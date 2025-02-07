import React, { useState } from "react";
import "./Dashboard.css";

const cursosMock = ["Curso 1", "Curso 2", "Curso 3", "Curso 4"];
const asignacionesMock = {
  "Curso 1": [
    { nombre: "Asig 1", fecha: "24/01/2025 - 12:00 AM", definicion: "Cypress" },
    { nombre: "Asig 2", fecha: "12/01/2025 - 12:00 AM", definicion: "Tp1" },
  ],
  "Curso 2": [
    { nombre: "Asig A", fecha: "10/02/2025 - 12:00 AM", definicion: "React" },
  ],
};

const Dashboard = () => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState("Curso 1");

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
          <button className="logout-btn">Cerrar sesión</button>
        </header>

        <table>
          <thead>
            <tr>
              <th>Asignación</th>
              <th>Fecha Límite</th>
              <th>Definición</th>
            </tr>
          </thead>
          <tbody>
            {asignacionesMock[cursoSeleccionado]?.map((asignacion, index) => (
              <tr key={index}>
                <td>{asignacion.nombre}</td>
                <td>{asignacion.fecha}</td>
                <td>{asignacion.definicion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Dashboard;
