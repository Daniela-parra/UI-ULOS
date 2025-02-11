import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/CreateAssignment.css";

const CreateAssignment = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [definiciones, setDefiniciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const definicionesGuardadas = JSON.parse(localStorage.getItem("definiciones")) || [];
    setDefiniciones(definicionesGuardadas);
  }, []);

  const handleDefinicionChange = (e) => {
    const valor = e.target.value;
    if (valor === "crear-nueva") {
      navigate("/createDefinition");
    } else {
      setDefinicion(valor);
    }
  };

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

    const asignacionesExistentes = JSON.parse(localStorage.getItem("asignaciones")) || [];
    asignacionesExistentes.push(nuevaAsignacion);
    localStorage.setItem("asignaciones", JSON.stringify(asignacionesExistentes));

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
      <div className="definicion-container">
        <select value={definicion} onChange={handleDefinicionChange}>
          <option value="">Seleccione un tipo</option>
          {definiciones.map((def, index) => (
            <option key={index} value={def}>{def}</option>
          ))}
          <option value="crear-nueva" style={{ color: "purple" }}>
            Crear nueva definición
          </option>
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
