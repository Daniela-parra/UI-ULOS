import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../Styles/Detail.css";

// Formatea los estados del backend
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

// Formatea un timestamp a DD/MM/YYYY HH:mm
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(5, 7);
  const day = timestamp.slice(8, 10);
  const hour = timestamp.slice(11, 13);
  const minute = timestamp.slice(14, 16);
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const Detail = () => {
  const navigate = useNavigate();
  const { id: assignmentId } = useParams();
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [tarea, setTarea] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/assignments/${assignmentId}`)
      .then((response) => {
        setTarea(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la asignación:", error);
        setError("Error al obtener los detalles de la asignación");
        setLoading(false);
      });
  }, [assignmentId]);

  useEffect(() => {
    if (!tarea) return;
    setTaskDetails(null);
    setAlreadySubmitted(false);

    const fetchTaskAndCheckSubmission = async () => {
      try {
        const response = await api.get(`/tasks?assignment_id=${tarea.id}`);
        let foundTask = null;
        if (Array.isArray(response.data) && response.data.length > 0) {
          foundTask = response.data[0];
        } else if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
          foundTask = response.data;
        }

        if (foundTask) {
          setTaskDetails(foundTask);
          setAlreadySubmitted(true);
        } else {
          setAlreadySubmitted(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAlreadySubmitted(false);
          console.log("No previous submission found for this assignment.");
        } else {
          console.error("Error al verificar/obtener el task:", error);
          setError("Error al verificar el estado del envío. Inténtalo de nuevo.");
          setAlreadySubmitted(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndCheckSubmission();
  }, [tarea]);

  const toggleFeedback = () => {
    setMostrarFeedback(!mostrarFeedback);
  };

  const handleSubmitAssignment = async () => {
    if (alreadySubmitted) {
      alert("Ya has enviado tu assignment y no puedes enviarlo nuevamente.");
      return;
    }

    if (!archivo) {
      alert("Por favor, seleccione un archivo para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    try {
      const submissionResponse = await api.post(`/assignments/${tarea.id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitSuccess("Assignment subido correctamente");
      setAlreadySubmitted(true);
      setArchivo(null);

      if (submissionResponse.data) {
        setTaskDetails(submissionResponse.data);
      } else {
        const taskResponse = await api.get(`/tasks?assignment_id=${tarea.id}`);
        let foundTask = null;
        if (Array.isArray(taskResponse.data) && taskResponse.data.length > 0) {
          foundTask = taskResponse.data[0];
        } else if (taskResponse.data && typeof taskResponse.data === "object" && !Array.isArray(taskResponse.data)) {
          foundTask = taskResponse.data;
        }
        setTaskDetails(foundTask);
      }
    } catch (error) {
      console.error("Error al subir el assignment:", error);
      alert("Hubo un error al subir el assignment.");
      setSubmitSuccess(null);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!tarea) return <div>No se encontraron detalles para esta asignación.</div>;

  return (
    <div className="task-detail-container">
      <header className="header">
        <h1 className="titulo">Detalles de la Asignación</h1>
      </header>

      <div className="task-info">
        <div className="input-group">
          <label>TÍTULO</label>
          <input type="text" value={tarea.assignment_name || ""} readOnly />
        </div>

        <div className="input-group">
          <label>FECHA LÍMITE</label>
          <input type="text" value={formatTimestamp(tarea.assignment_end_date)} readOnly />
        </div>

        <div className="input-group">
          <label>DESCRIPCIÓN</label>
          <textarea value={tarea.assignment_description || ""} readOnly />
        </div>

        <div className="input-group">
          <label>DEFINICIÓN</label>
          <input type="text" value={tarea.task_definition?.definition_name || ""} readOnly />
        </div>

        <div className="input-group">
          <label htmlFor="fileInput">Examinar Archivo</label>
          <div className="archivo-upload">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              onChange={(e) => setArchivo(e.target.files[0])}
              disabled={alreadySubmitted}
            />
            {archivo && !alreadySubmitted && <span>{archivo.name}</span>}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button className="btn upload-btn" onClick={handleSubmitAssignment} disabled={alreadySubmitted || !archivo}>
          {alreadySubmitted ? "Envío realizado" : "SUBIR"}
        </button>
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          VOLVER
        </button>
        {alreadySubmitted && taskDetails && (
          <button className="btn feedback-btn" onClick={toggleFeedback}>
            {mostrarFeedback ? "OCULTAR FEEDBACK" : "VER FEEDBACK"}
          </button>
        )}
      </div>

      {submitSuccess && <p className="success-message">{submitSuccess}</p>}

      {mostrarFeedback && alreadySubmitted && taskDetails && (
        <div className="feedback-section show">
          <h2>Feedback del Procesamiento</h2>
          {taskDetails.stage_statuses && taskDetails.stage_statuses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {taskDetails.stage_statuses.map((status) => (
                  <tr key={status.id}>
                    <td>{status.processing_stage?.stage_name || "N/A"}</td>
                    <td>{formatStatus(status.processing_status?.status_name)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>El procesamiento está en curso o aún no hay feedback detallado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Detail;
