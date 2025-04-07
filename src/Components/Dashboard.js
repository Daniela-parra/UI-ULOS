import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";
import api from "../api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  // Función para obtener la lista de estudiantes del curso seleccionado
  const fetchEstudiantes = async () => {
    if (!cursoSeleccionado) return;
    try {
      const response = await api.get(`/courses/${cursoSeleccionado}/students`);
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setEstudiantes([]);
    }
  };

  // Obtener la lista de cursos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await api.get("/courses");
        setCursos(response.data);
        if (response.data.length > 0) {
          setCursoSeleccionado(response.data[0].id); // Selecciona el primer curso por defecto
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCursos();
  }, []);

  // Obtener las asignaciones del curso seleccionado
  useEffect(() => {
    if (!cursoSeleccionado) return;

    const fetchAsignaciones = async () => {
      try {
        const response = await api.get(`/courses/${cursoSeleccionado}/assignments`);
        setAsignaciones(response.data);
      } catch (error) {
        console.error(`Error fetching assignments for course ${cursoSeleccionado}:`, error);
        setAsignaciones([]);
      }
    };
    fetchAsignaciones();
    fetchEstudiantes();
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

  const handleEliminar = async () => {
    if (!tareaSeleccionada) return;

    const confirmacion = window.confirm(
      `¿Estás seguro de que quieres eliminar la asignación "${tareaSeleccionada.assignment_name}"?`
    );
    if (!confirmacion) return;

    try {
      await api.delete(`/assignments/${tareaSeleccionada.id}`);
      const nuevasAsignaciones = asignaciones.filter(
        (tarea) => tarea.id !== tareaSeleccionada.id
      );
      setAsignaciones(nuevasAsignaciones);
      setTareaSeleccionada(null);
    } catch (error) {
      console.error("Error al eliminar la asignación:", error);
      alert("Hubo un problema al eliminar la asignación.");
    }
  };

  // Maneja la subida del archivo para actualizar la lista de estudiantes
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Tipos de archivo permitidos
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/csv",
    ];

    // Obtener la extensión del archivo
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["csv", "xls", "xlsx"];

    if (!validTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
      alert("Por favor, sube un archivo CSV o Excel válido (.csv, .xls, .xlsx).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/courses/${cursoSeleccionado}/upload_students`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Estudiantes añadidos correctamente.");
      // Vuelve a consultar la lista de estudiantes para actualizar la vista
      fetchEstudiantes();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    }
  };

  // Conecta el endpoint para eliminar un usuario de un curso y actualiza la lista
  const handleEliminarEstudiante = async () => {
    if (!estudianteSeleccionado) return;

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar al estudiante ${estudianteSeleccionado.nombre}?`
    );
    if (!confirmacion) return;

    try {
      await api.delete(`/courses/${cursoSeleccionado}/users/${estudianteSeleccionado.id}`);
      // Vuelve a consultar la lista de estudiantes después de la eliminación
      fetchEstudiantes();
      setEstudianteSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar el estudiante:", error);
      alert("Hubo un error al eliminar al estudiante.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Menú lateral */}
      <aside className="sidebar">
        <h3>Cursos</h3>
        <ul>
          {cursos.map((curso) => (
            <li
              key={curso.id}
              className={curso.id === cursoSeleccionado ? "active" : ""}
              onClick={() => setCursoSeleccionado(curso.id)}
            >
              {curso.course_name}
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

        {/* Sección de Estudiantes */}
        <div className="estudiantes-section">
          <h2>Lista de Estudiantes</h2>
          <div className="file-upload-container">
            <label htmlFor="archivo" className="file-upload-label">
              📁 Agregar / Actualizar lista de estudiantes
            </label>
            <input
              type="file"
              id="archivo"
              className="file-upload-input"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileUpload}
            />
          </div>
          {estudiantes.length === 0 ? (
            <p>No hay estudiantes aún.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est) => (
                  <tr
                    key={est.id}
                    className={estudianteSeleccionado?.id === est.id ? "selected" : ""}
                    onClick={() => setEstudianteSeleccionado(est)}
                  >
                    <td>{est.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            className="delete-btn"
            onClick={handleEliminarEstudiante}
            disabled={!estudianteSeleccionado}
          >
            🗑️ Eliminar
          </button>
        </div>

        {/* Sección de Asignaciones */}
        <h2>Asignaciones</h2>
        {asignaciones.length === 0 ? (
          <p>No hay asignaciones en este curso.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Asignación</th>
                <th>Fecha Límite</th>
                <th>Definición</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr
                  key={asignacion.id}
                  className={tareaSeleccionada?.id === asignacion.id ? "selected" : ""}
                  onClick={() => setTareaSeleccionada(asignacion)}
                >
                  <td>{asignacion.assignment_name}</td>
                  <td>{asignacion.assignment_end_date}</td>
                  <td>{asignacion.task_definition.definition_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          className="add-btn"
          onClick={() => navigate("/createAssignment", { state: { courseId: cursoSeleccionado } })}
        >
          +
        </button>

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
