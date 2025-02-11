import React from "react";
import { useNavigate, useParams } from "react-router-dom";


const DescriptionDefinition = () => {
  const navigate = useNavigate();
  const { nombreDefinicion } = useParams();

  // Datos de ejemplo para la definición
  const definicionEjemplo = {
    nombre: nombreDefinicion,
    descripcion: "Esta es una descripción de ejemplo para la definición.",
    etapas: [
      {
        titulo: "Etapa 1",
        descripcion: "Descripción de la etapa 1.",
        archivoNombre: "archivo1.pdf",
      },
      {
        titulo: "Etapa 2",
        descripcion: "Descripción de la etapa 2.",
        archivoNombre: "archivo2.pdf",
      },
    ],
  };

  return (
    <div className="container">
      <h1>Descripción de la Definición</h1>

      <div className="form-group">
        <label>NOMBRE DE LA DEFINICIÓN</label>
        <input type="text" value={definicionEjemplo.nombre} readOnly />
      </div>

      <div className="form-group">
        <label>DESCRIPCIÓN</label>
        <textarea value={definicionEjemplo.descripcion} readOnly />
      </div>

      <h2>ETAPAS</h2>
      {definicionEjemplo.etapas.map((etapa, index) => (
        <div key={index} className="etapa">
          <input type="text" value={etapa.titulo} readOnly />
          <input type="text" value={etapa.descripcion} readOnly />
          <span className="contenedor">{etapa.archivoNombre}</span>
          <button className="btn-descargar">Descargar</button>
        </div>
      ))}

      <button onClick={() => navigate(-1)} className="btn-volver">
        VOLVER
      </button>
    </div>
  );
};

export default DescriptionDefinition;
