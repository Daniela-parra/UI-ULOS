import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAssignment.css";

const CreateAssignment = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const navigate = useNavigate();

  const handleGuardar = () => {
    if (!titulo || !descripcion || !fecha || !definicion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevaAsignacion = {
      id: Date.now(),
      titulo,
      descripcion,
      fecha,
      definicion,
      archivo: archivo ? archivo.name : "Sin archivo",
    };

    // Obtener las asignaciones actuales
    const asignacionesExistentes = JSON.parse(localStorage.getItem("asignaciones")) || [];

    // Agregar la nueva asignación
    asignacionesExistentes.push(nuevaAsignacion);

    // Guardar en localStorage
    localStorage.setItem("asignaciones", JSON.stringify(asignacionesExistentes));

    // Redirigir al dashboard
    navigate("/dashboard");
  };

  return (
    <div className="crear-asignacion-container">
      <h1>Crear Nueva Asignación</h1>

      <label>Título</label>
      <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

      <label>Descripción</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <label>Fecha Límite</label>
      <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} />

      <label>Definición</label>
      <select value={definicion} onChange={(e) => setDefinicion(e.target.value)}>
        <option value="">Seleccione un tipo</option>
        <option value="Cypress">Cypress</option>
        <option value="Tp1">Tp1</option>
      </select>

      {/* Botón de Carga de Archivo */}
      <div className="file-upload-container">
        <label htmlFor="archivo" className="file-upload-label">
          Examinar archivo 📂
        </label>
        <input
          type="file"
          id="archivo"
          className="file-upload-input"
          onChange={(e) => setArchivo(e.target.files[0])}
        />
        {archivo && <span>{archivo.name}</span>}
      </div>

      {/* Botones */}
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
