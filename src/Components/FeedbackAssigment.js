import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Feedback.css";

const FeedbackAssignment = () => {
  const navigate = useNavigate();

  const estudiantes = [
    { nombre: "Est_1", parser: "✔️ Completada", executor: "✔️ Completada" },
    { nombre: "Est_2", parser: "❌ Fallido", executor: "⏳ En progreso" },
    { nombre: "Est_3", parser: "⏳ En progreso", executor: "❌ Pendiente" },
    { nombre: "Est_4", parser: "❕ Pendiente", executor: "❕ Pendiente" },
  ];

  return (
    <div className="feedback-container">
      <main className="feedback-content">
        <header className="feedback-header">
          <h1>Feedback</h1>
        </header>

        <table className="feedback-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Estado Parser</th>
              <th>Estado Executor</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est, index) => (
              <tr key={index}>
                <td>{est.nombre}</td>
                <td>{est.parser}</td>
                <td>{est.executor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="back-btn" onClick={() => navigate(-1)}>
          VOLVER
        </button>
      </main>
    </div>
  );
};

export default FeedbackAssignment;
