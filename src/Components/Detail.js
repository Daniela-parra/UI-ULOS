import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../Styles/Detail.css";

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Id de la asignación desde la URL
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [tarea, setTarea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const toggleFeedback = () => {
    setMostrarFeedback(!mostrarFeedback);
  };

  // Obtener detalles de la asignación
  useEffect(() => {
    api
      .get(`/assignments/${id}`)
      .then((response) => {
        setTarea(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la asignación:", error);
        setError("Error al obtener los detalles");
        setLoading(false);
      });
  }, [id]);


  useEffect(() => {
    const checkSubmission = async () => {
      if (tarea) {
        try {
          const tasksResponse = await api.get(`/tasks?assignment_id=${tarea.id}`);
          if (tasksResponse.data !== null) {
            setAlreadySubmitted(true);
          }
        } catch (error) {
          console.error("Error al verificar el envío previo:", error);
        }
      }
    };

    checkSubmission();
  }, [tarea]);


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
      await api.post(`/assignments/${tarea.id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitSuccess("Assignment subido correctamente");
      setAlreadySubmitted(true);
    } catch (error) {
      console.error("Error al subir el assignment:", error);
      alert("Hubo un error al subir el assignment.");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="task-detail-container">
      <header className="header">
        <h1 className="titulo">Detalles de la Asignación</h1>
      </header>

      <div className="task-info">
        <div className="input-group">
          <label>TÍTULO</label>
          <input type="text" value={tarea.assignment_name} readOnly />
        </div>

        <div className="input-group">
          <label>FECHA LÍMITE</label>
          <input type="text" value={tarea.assignment_end_date} readOnly />
        </div>

        <div className="input-group">
          <label>DESCRIPCIÓN</label>
          <textarea value={tarea.assignment_description} readOnly />
        </div>

        <div className="input-group">
          <label>DEFINICIÓN</label>
          <input type="text" value={tarea.task_definition.definition_name} readOnly />
        </div>

        <div className="input-group">
          <label>Examinar Archivo</label>
          <div className="archivo-upload">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              onChange={(e) => setArchivo(e.target.files[0])}
              disabled={alreadySubmitted}
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button
          className="btn upload-btn"
          onClick={handleSubmitAssignment}
          disabled={alreadySubmitted}
        >
          {alreadySubmitted ? "Envío realizado" : "SUBIR"}
        </button>
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          VOLVER
        </button>
        <button className="btn feedback-btn" onClick={toggleFeedback}>
          FEEDBACK
        </button>
      </div>

      {submitSuccess && <p className="success-message">{submitSuccess}</p>}

      {mostrarFeedback && (
        <div className="feedback-section show">
          <h2>Feedback</h2>
          <table>
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Estado</th>
                <th>Archivo</th>
                <th>Tiempo de duración</th>
              </tr>
            </thead>
            <tbody>
              {tarea.feedback.etapas.map((etapa, index) => (
                <tr key={index}>
                  <td>{etapa.nombre}</td>
                  <td>{etapa.estado}</td>
                  <td>
                    <button className="download-btn">{etapa.archivo}</button>
                  </td>
                  <td>{etapa.tiempo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="archivo-final">
            <label>ARCHIVO FINAL</label>
            <span>
              {tarea.feedback.archivoFinal.nombre} ({tarea.feedback.archivoFinal.tamano})
            </span>
            <button className="download-btn">Descargar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
