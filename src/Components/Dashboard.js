import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";

const cursosMock = ["Curso 1", "Curso 2", "Curso 3", "Curso 4"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [cursoSeleccionado, setCursoSeleccionado] = useState("Curso 1");
  const [asignaciones, setAsignaciones] = useState({});
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  useEffect(() => {
    const asignacionesGuardadas = JSON.parse(localStorage.getItem("asignaciones")) || [];
    const asignacionesPorCurso = {};
    asignacionesGuardadas.forEach((asig) => {
      if (!asignacionesPorCurso[cursoSeleccionado]) {
        asignacionesPorCurso[cursoSeleccionado] = [];
      }
      asignacionesPorCurso[cursoSeleccionado].push(asig);
    });

    setAsignaciones(asignacionesPorCurso);
  }, [cursoSeleccionado]);

  const handleEditar = () => {
    if (tareaSeleccionada) {
      navigate(`/editAssignment/${tareaSeleccionada.id}`);
    }
  };

  const handleFeedback = () => {
    if (tareaSeleccionada) {
      navigate(`/feedback/${tareaSeleccionada.id}`);
    }
  };

  const handleEliminar = () => {
    if (tareaSeleccionada) {
      // Filtrar la tarea eliminada
      const nuevasAsignaciones = asignaciones[cursoSeleccionado].filter(
        (tarea) => tarea.id !== tareaSeleccionada.id
      );
      // Actualizar estado y localStorage
      setAsignaciones((prev) => ({
        ...prev,
        [cursoSeleccionado]: nuevasAsignaciones,
      }));
      localStorage.setItem("asignaciones", JSON.stringify(Object.values(nuevasAsignaciones).flat()));

      // Limpiar selección
      setTareaSeleccionada(null);
    }
  };
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
            </tr>
          </thead>
          <tbody>
            {asignaciones[cursoSeleccionado]?.map((asignacion, index) => (
              <tr
                key={index}
                className={tareaSeleccionada?.id === asignacion.id ? "selected" : ""}
                onClick={() => setTareaSeleccionada(asignacion)}
              >
                <td>{asignacion.titulo}</td>
                <td>{asignacion.fecha}</td>
                <td>{asignacion.definicion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón de agregar asignación arriba */}
        <button className="add-btn" onClick={() => navigate("/createAssignment")}>
          +
        </button>

        {/* Botones de Editar y Feedback */}
        <div className="botones-container"></div>
          <div className="btn-group">
            <button className="edit-btn" onClick={handleEditar} disabled={!tareaSeleccionada}>
              ✏️ Editar
            </button>
            <button className="feedback-btn" onClick={handleFeedback} disabled={!tareaSeleccionada}>
              💬 Feedback
            </button>
            <button className="delete-btn" onClick={handleEliminar} disabled={!tareaSeleccionada}>
              🗑️ Eliminar
            </button>
          </div>
      </main>
    </div>
  );
};

export default Dashboard;
