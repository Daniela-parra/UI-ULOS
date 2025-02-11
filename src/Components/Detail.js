import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import "../Styles/Detail.css";

const Detail = () => {
  const navigate = useNavigate();
  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  const toggleFeedback = () => {
    setMostrarFeedback(!mostrarFeedback);
  };

  // Datos simulados para pruebas
  const tarea = {
    titulo: "Asig 1",
    fechaLimite: "27/01/2025 - 12:00 AM",
    descripcion: "Descripción completa de la asignación ...",
    definicion: "Cypress",
    archivosAdjuntos: [{ nombre: "ASIG1.PDF", tamano: "125 KB" }],
    feedback: {
      etapas: [
        { nombre: "Parser", estado: "Completada", archivo: "PARSER.JSON", tiempo: "10 min" },
        { nombre: "Executor", estado: "Completada", archivo: "EXECUTOR.JSON", tiempo: "15 min" }
      ],
      archivoFinal: { nombre: "ARCHIVOFINAL", tamano: "125 KB" },
    },
  };

  return (
    <div className="task-detail-container">

      <header className="header">
         <h1 className="titulo">Detalles de la Asignación</h1>
      </header>

      <div className="task-info">
        <div className="input-group">
          <label>TÍTULO</label>
          <input type="text" value={tarea.titulo} readOnly />
        </div>

        <div className="input-group">
          <label>FECHA LÍMITE</label>
          <input type="text" value={tarea.fechaLimite} readOnly />
        </div>

        <div className="input-group">
          <label>DESCRIPCIÓN</label>
          <textarea value={tarea.descripcion} readOnly />
        </div>

        <div className="input-group">
          <label>DEFINICIÓN</label>
          <input type="text" value={tarea.definicion} readOnly />
        </div>
        <div className="input-group">
                <label>Examinar Archivo</label>
                <div className="archivo-upload">
                    <input type="file" id="fileInput" className="file-input" />
                </div>
        </div>

        <div className="input-group">
          <label>ARCHIVOS ADJUNTOS</label>
          {tarea.archivosAdjuntos.map((archivo, index) => (
            <div key={index} className="archivo">
              <span>
                {archivo.nombre} ({archivo.tamano})
              </span>
              <button className="download-btn">Descargar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="buttons">
        <button className="btn upload-btn">SUBIR</button>
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          VOLVER
        </button>
        <button className="btn feedback-btn" onClick={toggleFeedback}>
          FEEDBACK
        </button>
      </div>

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
