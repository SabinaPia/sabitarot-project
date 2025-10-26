import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import photo from "../assets/user1.jpg";
import cardData from "../assets/cards.json";
import { createReading, getUserReadings } from "../api.js";

export default function Home({ user }) {
  const navigate = useNavigate();

  // Estados
  const [pregunta, setPregunta] = useState("");
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [historial, setHistorial] = useState([]);
  const [currentCombo, setCurrentCombo] = useState(null);
  const [revealed, setRevealed] = useState(false);

  // Cargar historial al iniciar
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchHistorial();
  }, [user]);

  const fetchHistorial = async () => {
    try {
      const readings = await getUserReadings(user.id);

      // Ordenar por fecha descendente
      const sortedReadings = readings.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // Mapear a objetos con fecha/hora local formateada
      const formattedReadings = sortedReadings.map((r) => {
        const date = new Date(r.created_at + "Z"); // forzar UTC
        const localTime = date.toLocaleString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        return {
          question: r.question,
          answer: r.answer,
          createdAt: localTime,
        };
      });

      setHistorial(formattedReadings);
    } catch (err) {
      console.error(err);
    }
  };


  const handleGenerar = async () => {
    if (!pregunta.trim()) {
      setError("Por favor ingresa una pregunta antes de generar.");
      return;
    }
    setError("");

    // Elegir combinación aleatoria
    const randomIndex = Math.floor(Math.random() * cardData.length);
    const combo = cardData[randomIndex];
    setCurrentCombo(combo);
    setRevealed(true);

    // Generar respuesta simulada
    setRespuesta(combo.meaning);
    setMostrarRespuesta(true);

  };

  const handleGuardar = async () => {
    if (!currentCombo || !pregunta) return; // evitar guardar si no hay tirada

    try {
      await createReading(user.id, pregunta, respuesta);
      fetchHistorial(); // actualizar historial
      alert("Tirada guardada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al guardar la tirada.");
    }
  };

  const handleReiniciar = () => {
    setPregunta("");
    setRespuesta("");
    setMostrarRespuesta(false);
    setError("");
    setCurrentCombo(null);
    setRevealed(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const coverImage = "/cards/card-back.png"; // Imagen de la tapa

  return (
    <div className="flex h-screen w-screen bg-[#0f0f0f]">
      {/* Bloque izquierdo 30% */}
      <div className="w-[30%] bg-[#1e1e2f] flex flex-col items-center p-4">
        <div className="mb-4 flex flex-col items-center">
          <motion.img
            src={logo}
            alt="Logo"
            className="w-28 h-20 mx-auto mb-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-2xl font-bold text-yellow-400"
            style={{ textShadow: "0 0 1px #FFD700, 0 0 4px #FFD700, 0 0 2px #FFD700" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            SABITAROT
          </motion.h1>
        </div>

        <div className="mb-4 flex flex-col items-center mt-auto">
          <img src={photo} alt="Perfil" className="w-20 h-20 rounded-full mb-2 object-cover" />
          <p className="text-white font-medium">{user.username}</p>
        </div>

        <h2 className="text-white font-semibold text-2xl mb-4 underline">Historial</h2>
        {/* Historial scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {historial.map((item, index) => (
              <div key={index} className="bg-[#2a2a3d] p-2 rounded-lg text-white">
                <p><strong>Fecha:</strong> {item.createdAt}</p>
                <p><strong>Pregunta:</strong> {item.question}</p>
                <p><strong>Significado:</strong> {item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botón Logout fijo abajo */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Bloque derecho 70% */}
      <div className="w-[70%] bg-[#121212] flex flex-col items-center p-4">
        {/* Cartas de tarot */}
        <div className="flex justify-center space-x-4 mt-4">
          {(revealed && currentCombo ? currentCombo.cards : [0,1,2]).map((card, index) => {
            const isRevealed = revealed && currentCombo;
            const imageSrc = isRevealed ? card.image : coverImage;
            const cardName = isRevealed ? card.name : "Carta boca abajo";

            return (
              <motion.div
                key={index}
                className="w-40 h-60 perspective"
              >
                <motion.div
                  className="w-full h-full relative rounded-lg shadow-lg cursor-pointer"
                  animate={{ rotateY: isRevealed ? 0 : 180 }}
                  transition={{ duration: 0.8 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={imageSrc}
                    alt={cardName}
                    className="w-full h-full object-contain rounded-lg absolute backface-hidden"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Sección pregunta/respuesta */}
        <div className="flex flex-col items-center w-full max-w-lg mt-6 min-h-[200px]">
          {!mostrarRespuesta ? (
            <motion.div
              key="pregunta"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <label className="text-white mb-2" htmlFor="pregunta">
                Ingresa tu pregunta
              </label>
              <input
                id="pregunta"
                type="text"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2a2a3d] text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              <button
                onClick={handleGenerar}
                className="mt-4 self-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Generar
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="respuesta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <p className="text-white font-semibold mb-2">Respuesta:</p>
              <div className="w-full px-4 py-3 rounded-lg bg-[#2a2a3d] text-white mb-4 text-center">
                {respuesta}
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleReiniciar}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Reiniciar
                </button>
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={handleGuardar} // antes era solo alert
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
