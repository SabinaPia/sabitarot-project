import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { registerUser, loginUser } from "../api.js";

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      if (isLogin) {
        // Login
        const userData = await loginUser(username, password);
        onLogin(userData);      // guarda usuario en App.jsx
        navigate("/home");      // redirige al Home
      } else {
        // Registro
        await registerUser(username, password);
        alert("Registro exitoso, ya puedes iniciar sesión");
        setUsername("");
        setPassword("");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Usuario o contraseña inválidos");
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(255,255,255,0.3)" },
    tap: { scale: 0.95 },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a]">
      <div className="w-full max-w-sm bg-[#1e1e2f] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <motion.img
            src={logo}
            alt="Logo"
            className="w-28 h-20 mx-auto mb-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-3xl font-bold text-yellow-400"
            style={{ textShadow: "0 0 1px #FFD700, 0 0 4px #FFD700, 0 0 2px #FFD700" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            SABITAROT
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
                <motion.input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-64 max-w-full px-4 py-2 rounded-lg bg-[#2a2a3d] text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-64 max-w-full px-4 py-2 rounded-lg bg-[#2a2a3d] text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <motion.button
                  type="submit"
                  className="w-64 max-w-full py-2 font-semibold rounded-lg bg-purple-600 text-white transition"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Entrar
                </motion.button>
              </form>
              <p className="mt-4 text-sm text-gray-300 text-center">
                ¿No tienes cuenta?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-purple-400 hover:underline cursor-pointer transition"
                >
                  Regístrate
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
                <motion.input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-64 max-w-full px-4 py-2 rounded-lg bg-[#2a2a3d] text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-64 max-w-full px-4 py-2 rounded-lg bg-[#2a2a3d] text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <motion.button
                  type="submit"
                  className="w-64 max-w-full py-2 font-semibold rounded-lg bg-purple-600 text-white transition"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Registrarse
                </motion.button>
              </form>
              <p className="mt-4 text-sm text-gray-300 text-center">
                ¿Ya tienes cuenta?{" "}
                <span
                  onClick={() => setIsLogin(true)}
                  className="text-purple-400 hover:underline cursor-pointer transition"
                >
                  Inicia sesión
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
