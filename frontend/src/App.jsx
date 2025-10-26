import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/home";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth onLogin={setUser} />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


