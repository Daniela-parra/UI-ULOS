import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../Styles/Dashboard.css';

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

// Formatea un timestamp (ISO 8601) a DD/MM/YYYY HH:mm
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(5, 7);
  const day = timestamp.slice(8, 10);
  const hour = timestamp.slice(11, 13);
  const minute = timestamp.slice(14, 16);
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  // Obtiene los cursos al montar el componente
  useEffect(() => {
    api
      .get('/courses')
      .then((response) => {
        const coursesData = response.data;
        setCursos(coursesData);
        if (coursesData.length > 0) {
          setCursoSeleccionado(coursesData[0]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los cursos:', error);
      });
  }, []);

  // Cada vez que se selecciona un curso, se obtienen sus asignaciones
  useEffect(() => {
    if (cursoSeleccionado) {
      api
        .get(`/courses/${cursoSeleccionado.id}/assignments`)
        .then((response) => {
          const transformedAsignaciones = response.data.map((asignacion) => {
            let estadoParser = 'N/A';
            let estadoExecutor = 'N/A';

            if (asignacion.tasks && asignacion.tasks.length > 0) {
              const firstTask = asignacion.tasks[0];
              if (firstTask.stage_statuses) {
                const parsingStage = firstTask.stage_statuses.find(
                  (s) => s.processing_stage.stage_name === 'PARSING'
                );
                if (parsingStage) {
                  estadoParser = parsingStage.processing_status.status_name;
                }

                const executionStage = firstTask.stage_statuses.find(
                  (s) => s.processing_stage.stage_name === 'EXECUTION'
                );
                if (executionStage) {
                  estadoExecutor = executionStage.processing_status.status_name;
                }
              }
            }

            // Usa la función formatTimestamp para la fecha
            const formattedEndDate = formatTimestamp(asignacion.assignment_end_date);

            return {
              ...asignacion,
              estadoParser,
              estadoExecutor,
              formatted_assignment_end_date: formattedEndDate,
            };
          });
          setAsignaciones(transformedAsignaciones);
        })
        .catch((error) => {
          console.error('Error al obtener asignaciones:', error);
        });
    }
  }, [cursoSeleccionado]);

  const handleVerDetalle = () => {
    if (tareaSeleccionada) {
      navigate(`/detail/${tareaSeleccionada.id}`);
    }
  };

  return (
    <div className='dashboard-container'>
      <aside className='sidebar'>
        <h3>Cursos</h3>
        <ul>
          {cursos.map((curso) => (
            <li
              key={curso.id}
              className={curso === cursoSeleccionado ? 'active' : ''}
              onClick={() => setCursoSeleccionado(curso)}
            >
              {curso.course_name}
            </li>
          ))}
        </ul>
      </aside>

      <main className='content'>
        <header>
          <h1>Asignaciones - {cursoSeleccionado?.course_name}</h1>
          <button className='logout-btn' onClick={() => navigate('/')}>
            Cerrar sesión
          </button>
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
            {asignaciones.map((asignacion) => (
              <tr
                key={asignacion.id}
                className={tareaSeleccionada?.id === asignacion.id ? 'selected' : ''}
                onClick={() => setTareaSeleccionada(asignacion)}
              >
                <td>{asignacion.assignment_name}</td>
                <td>{asignacion.formatted_assignment_end_date}</td>
                <td>{formatStatus(asignacion.estadoParser)}</td>
                <td>{formatStatus(asignacion.estadoExecutor)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="botones-container">
          <button
            className="detail-btn"
            onClick={handleVerDetalle}
            disabled={!tareaSeleccionada}
          >
            VER DETALLE
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
