import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../Styles/Feedback.css";

const FeedbackAssignment = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapea los status del backend a iconos/textos legibles
  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "❕ Pendiente";
      case "IN_PROGRESS":
        return "⏳ En progreso";
      case "COMPLETED":
        return "✔️ Completada";
      case "FAILED":
        return "❌ Fallido";
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await api.get(`/assignments/${assignmentId}/tasks`);
        const mapped = res.data.map((item) => ({
          nombre: item.student_email,
          parser: formatStatus(item.parsing_status),
          executor: formatStatus(item.execution_status),
        }));
        setEstudiantes(mapped);
      } catch (err) {
        console.error("Error fetching task statuses:", err);
        setError("No se pudieron cargar los estados.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="feedback-container">
        <main className="feedback-content">
          <p>Cargando estados…</p>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div className="feedback-container">
        <main className="feedback-content">
          <p className="error">{error}</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            VOLVER
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <main className="feedback-content">
        <header className="feedback-header">
          <h1>Feedback Asignación #{assignmentId}</h1>
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
