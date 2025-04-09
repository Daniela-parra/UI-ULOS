import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const DescriptionDefinition = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [definicion, setDefinicion] = useState(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const response = await api.get(`/task-definitions/${id}`);
        setDefinicion(response.data);
      } catch (error) {
        console.error("Error fetching definition:", error);
      }
    };

    fetchDefinition();
  }, [id]);

  if (!definicion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Descripción de la Definición</h1>

      <div className="form-group">
        <label>NOMBRE DE LA DEFINICIÓN</label>
        <input type="text" value={definicion.definition_name} readOnly />
      </div>

      <div className="form-group">
        <label>DESCRIPCIÓN</label>
        <textarea value={definicion.definition_description} readOnly />
      </div>

      <h2>ETAPAS</h2>
      {definicion.stages.map((etapa, index) => (
        <div key={index} className="etapa">
          <input type="text" value={etapa.stage_name} readOnly />
          <input type="text" value={etapa.stage_description} readOnly />
          <input type="text" value={etapa.container.container_name} readOnly />
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
