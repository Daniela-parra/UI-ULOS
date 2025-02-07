import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateAssignment.css";

const EditAssignment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const asignaciones = JSON.parse(localStorage.getItem("asignaciones")) || [];
    const tarea = asignaciones.find((asig) => asig.id === parseInt(id));
    if (tarea) {
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion);
      setFecha(tarea.fecha);
      setDefinicion(tarea.definicion);
    }
  }, [id]);

  const handleGuardar = () => {
    if (!titulo || !descripcion || !fecha || !definicion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const asignaciones = JSON.parse(localStorage.getItem("asignaciones")) || [];
    const nuevasAsignaciones = asignaciones.map((asig) =>
      asig.id === parseInt(id)
        ? { ...asig, titulo, descripcion, fecha, definicion, archivo: archivo ? archivo.name : asig.archivo }
        : asig
    );

    localStorage.setItem("asignaciones", JSON.stringify(nuevasAsignaciones));
    navigate("/dashboard");
  };

  return (
    <div className="crear-asignacion-container">
      <h1>Editar Asignación</h1>

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

      <div className="file-upload-container">
        <label htmlFor="archivo" className="file-upload-label">
          Examinar archivo 📂
        </label>
        <input type="file" id="archivo" className="file-upload-input" onChange={(e) => setArchivo(e.target.files[0])} />
        {archivo && <span>{archivo.name}</span>}
      </div>

      <div className="btn-group">
        <button onClick={handleGuardar}>Guardar</button>
        <button className="cancelar" onClick={() => navigate("/dashboard")}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditAssignment;
