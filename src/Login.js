import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulación de autenticación
    if (email === "profesor@uniandes" || email === "admin@uniandes") {
      setUserRole("profesor"); // O "admin"
      navigate("/dashboard");
    } else {
      alert("Acceso denegado o usuario no reconocido.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="title">Bienvenid@ !</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn">INICIAR SESIÓN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
