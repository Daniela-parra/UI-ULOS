import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const cursosMock = ["Curso 1", "Curso 2", "Curso 3", "Curso 4"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [cursoSeleccionado, setCursoSeleccionado] = useState("Curso 1");
  const [asignaciones, setAsignaciones] = useState({});

  useEffect(() => {
    // Obtener las asignaciones guardadas en localStorage
    const asignacionesGuardadas = JSON.parse(localStorage.getItem("asignaciones")) || [];

    // Agrupar las asignaciones por curso
    const asignacionesPorCurso = {};
    asignacionesGuardadas.forEach((asig) => {
      if (!asignacionesPorCurso[cursoSeleccionado]) {
        asignacionesPorCurso[cursoSeleccionado] = [];
      }
      asignacionesPorCurso[cursoSeleccionado].push(asig);
    });

    setAsignaciones(asignacionesPorCurso);
  }, [cursoSeleccionado]);

  return (
    <div className="dashboard-container">
      {/* Menú lateral */}
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

      {/* Contenido principal */}
      <main className="content">
        <header>
          <h1>Asignaciones - {cursoSeleccionado}</h1>
          <button className="logout-btn" onClick={() => navigate("/")}>
            Cerrar sesión
          </button>
        </header>

        <table>
          <thead>
            <tr>
              <th>Asignación</th>
              <th>Fecha Límite</th>
              <th>Definición</th>
              <th>Archivo</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones[cursoSeleccionado]?.map((asignacion, index) => (
              <tr key={index}>
                <td>{asignacion.titulo}</td>
                <td>{asignacion.fecha}</td>
                <td>{asignacion.definicion}</td>
                <td>{asignacion.archivo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón de agregar asignación */}
        <button className="add-btn" onClick={() => navigate("/createAssignment")}>
          +
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
