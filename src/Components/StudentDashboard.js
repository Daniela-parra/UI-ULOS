import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";

const cursosMock = ["Curso 1", "Curso 2", "Curso 3", "Curso 4"];

const asignacionesMock = {
  "Curso 1": [
    { id: 1, titulo: "Asig 1", fecha: "24/01/2025 - 12:00 AM", estadoParser: "Completada", estadoExecutor: "Completada" },
    { id: 2, titulo: "Asig 2", fecha: "12/01/2025 - 12:00 AM", estadoParser: "Completada", estadoExecutor: "En progreso" },
  ],
  "Curso 2": [
    { id: 3, titulo: "Asig 3", fecha: "04/02/2025 - 12:00 AM", estadoParser: "En progreso", estadoExecutor: "Pendiente" },
    { id: 4, titulo: "Asig 4", fecha: "24/04/2025 - 12:00 AM", estadoParser: "Pendiente", estadoExecutor: "Pendiente" },
  ],
  "Curso 3": [],
  "Curso 4": [],
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [cursoSeleccionado, setCursoSeleccionado] = useState("Curso 1");
  const [asignaciones, setAsignaciones] = useState(asignacionesMock);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  useEffect(() => {
    const asignacionesGuardadas = JSON.parse(localStorage.getItem("asignaciones")) || {};
    setAsignaciones({ ...asignacionesMock, ...asignacionesGuardadas });
  }, []);

  const handleVerDetalle = () => {
    if (tareaSeleccionada) {
      navigate(`/detail/${tareaSeleccionada.id}`);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Cursos</h3>
        <ul>
          {cursosMock.map((curso) => (
            <li
              key={curso}
              className={curso === cursoSeleccionado ? "active" : ""}
              onClick={() => setCursoSeleccionado(curso)}
            >
              {curso}
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        <header>
          <h1>Asignaciones - {cursoSeleccionado}</h1>
          <button className="logout-btn" onClick={() => navigate("/")}>Cerrar sesión</button>
        </header>

        <table>
          <thead>
            <tr>
              <th>Asignación</th>
              <th>Fecha Límite</th>
              <th>Estado Parser</th>
              <th>Estado Executor</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones[cursoSeleccionado]?.map((asignacion) => (
              <tr
                key={asignacion.id}
                className={tareaSeleccionada?.id === asignacion.id ? "selected" : ""}
                onClick={() => setTareaSeleccionada(asignacion)}
              >
                <td>{asignacion.titulo}</td>
                <td>{asignacion.fecha}</td>
                <td>{asignacion.estadoParser}</td>
                <td>{asignacion.estadoExecutor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="botones-container">
          <button className="detail-btn" onClick={handleVerDetalle} disabled={!tareaSeleccionada}>
            VER DETALLE
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
