import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api"; // Importa api.js
import "../Styles/CreateAssignment.css";

import { useLocation } from "react-router-dom";

const CreateAssignment = () => {
  const location = useLocation();
  const courseId = location.state?.courseId; // Obtiene courseId de la navegación
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [definiciones, setDefiniciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDefiniciones = async () => {
      try {
        const response = await api.get("/task-definitions"); // Obtiene las definiciones desde el backend
        setDefiniciones(response.data);
      } catch (error) {
        console.error("Error al obtener definiciones:", error);
      }
    };

    fetchDefiniciones();
  }, []);

  const handleDefinicionChange = (e) => {
    const valor = e.target.value;
    setDefinicion(valor);
  };

  const handleGuardar = async () => {
    if (!titulo || !descripcion || !fechaFin || !definicion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevaAsignacion = {
      task_definition_id: Number(definicion),
      assignment_name: titulo,
      assignment_description: descripcion,
      assignment_start_date: new Date().toISOString().split('.')[0] + 'Z', 
      assignment_end_date: new Date(fechaFin).toISOString().split('.')[0] + 'Z'
    };

    try {
      await api.post(`/courses/${courseId}/assignments`, nuevaAsignacion);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al guardar la asignación:", error);
      alert("Hubo un problema al guardar la asignación");
    }
  };

  return (
    <div className="crear-asignacion-container">
      <h1>Crear Nueva Asignación</h1>

      <label>Título</label>
      <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

      <label>Descripción</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <label>Fecha Límite</label>
      <input type="datetime-local" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

      <label>Definición</label>
      <div className="definicion-container">
        <select value={definicion} onChange={handleDefinicionChange}>
          <option value="">Seleccione una definición</option>
          {definiciones.map((def) => (
            <option key={def.id} value={def.id}>
              {def.definition_name}
            </option>
          ))}
        </select>
        {definicion && definicion !== "crear-nueva" && (
          <button
          className="btn-lupa"
          onClick={() => navigate(`/descriptionDefinition/${definicion}`)}
        >
          🔍
        </button>
        )}
      </div>

      <div className="btn-group">
        <button onClick={handleGuardar}>Guardar</button>
        <button className="cancelar" onClick={() => navigate("/dashboard")}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CreateAssignment;
