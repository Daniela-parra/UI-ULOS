import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });

      const { access_token, role } = response.data;

      if (access_token) {
        localStorage.setItem('jwt', access_token);
      }

      if (role === 'professor' || role === 'admin') {
        setUserRole(role);
        navigate('/dashboard');
      } else if (role === 'student') {
        setUserRole(role);
        navigate('/studentDashboard');
      } else {
        alert('Acceso denegado o usuario no reconocido.');
      }

    } catch(error) {
      console.error(error)
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
