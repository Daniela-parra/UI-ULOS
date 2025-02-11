import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Usa los mismos estilos de Login si quieres

const Register = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="title">Crear nueva cuenta</h2>
        <p className="text-sm">
          ¿Ya estás registrado? <Link to="/" className="text-purple-700 font-bold">Inicia sesión</Link>
        </p>
        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="hello@uniandes.edu.co" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" />
          </div>
          <div className="input-group">
            <label>Rol</label>
            <select>
              <option>Seleccione su rol</option>
              <option>Estudiante</option>
              <option>Profesor</option>
              <option>Asistente</option>
              <option>Administrador</option>
            </select>
          </div>
          <button className="login-btn">REGISTRARSE</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
