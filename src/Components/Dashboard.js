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
        setAsignaciones(response.data); // Guarda las asignaciones del curso
      } catch (error) {
        console.error(`Error fetching assignments for course ${cursoSeleccionado}:`, error);
        setAsignaciones([]); // Vacía las asignaciones si hay un error
      }
    };

    fetchAsignaciones();
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Tipos de archivo permitidos
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel (XLSX)
      "application/vnd.ms-excel", // Excel (XLS) y a veces CSV
      "text/csv", // CSV
      "application/csv", // CSV en algunos navegadores
    ];
  
    // Obtener la extensión del archivo
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["csv", "xls", "xlsx"];
  
    if (!validTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
      alert("Por favor, sube un archivo CSV o Excel válido (.csv, .xls, .xlsx).");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result.split("\n").map((line) => line.split(","));
      const nuevosEstudiantes = content.map((row, index) => ({
        id: index,
        nombre: row[0] || "Desconocido",
        correo: row[1] || "Sin correo",
        codigo: row[2] || "Sin código",
      }));
  
      setEstudiantes(nuevosEstudiantes);
    };
  
    reader.readAsText(file);
  };
  

  const handleEliminarEstudiante = () => {
    if (estudianteSeleccionado) {
      setEstudiantes(estudiantes.filter((est) => est.id !== estudianteSeleccionado.id));
      setEstudianteSeleccionado(null);
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
              <th>Estudiante</th>
              <th>Correo</th>
              <th>Código</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est) => (
              <tr
                key={est.id}
                className={estudianteSeleccionado?.id === est.id ? "selected" : ""}
                onClick={() => setEstudianteSeleccionado(est)}
              >
                <td>{est.nombre}</td>
                <td>{est.correo}</td>
                <td>{est.codigo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="delete-btn" onClick={handleEliminarEstudiante} disabled={!estudianteSeleccionado}>
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

        <button className="add-btn" onClick={() => navigate("/createAssignment", { state: { courseId: cursoSeleccionado } })}>+</button>


        <div className="btn-group">
          <button className="edit-btn" onClick={handleEditar} disabled={!tareaSeleccionada}>✏️ Editar</button>
          <button className="feedback-btn" onClick={handleFeedback} disabled={!tareaSeleccionada}>💬 Feedback</button>
          <button className="delete-btn" onClick={handleEliminar} disabled={!tareaSeleccionada}>🗑️ Eliminar</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
