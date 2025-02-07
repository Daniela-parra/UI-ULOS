import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateDefinition.css";

const CreateDefinition = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [etapas, setEtapas] = useState([{ titulo: "", descripcion: "", archivoNombre: "", checked: false }]);
  const navigate = useNavigate();

  const handleGuardar = () => {
    if (!nombre) {
      alert("Por favor, ingrese un nombre para la definición.");
      return;
    }

    try {
      const definicionesGuardadas = JSON.parse(localStorage.getItem("definiciones")) || [];
      definicionesGuardadas.push(nombre); // Solo guarda el título
      localStorage.setItem("definiciones", JSON.stringify(definicionesGuardadas));

      console.log("Definición guardada correctamente:", nombre);
      navigate(-1);
    } catch (error) {
      console.error("Error al guardar en localStorage:", error);
      alert("Hubo un problema al guardar la definición.");
    }
  };

  const handleEtapaChange = (index, campo, valor) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[index][campo] = valor;
    setEtapas(nuevasEtapas);
  };

  const handleArchivoChange = (index, archivo) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[index].archivoNombre = archivo.name;
    setEtapas(nuevasEtapas);
  };

  const agregarEtapa = () => {
    setEtapas([...etapas, { titulo: "", descripcion: "", archivoNombre: "", checked: false }]);
  };

  const eliminarEtapa = (index) => {
    setEtapas(etapas.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1>CREAR NUEVA DEFINICIÓN</h1>

      <div className="form-group">
        <label>NOMBRE DE LA DEFINICIÓN</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div className="form-group">
        <label>DESCRIPCIÓN</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      <h2>ETAPAS</h2>
      {etapas.map((etapa, index) => (
        <div key={index} className="etapa">
          <input type="checkbox" checked={etapa.checked} onChange={(e) => handleEtapaChange(index, "checked", e.target.checked)} />
          <input type="text" placeholder="Título de la etapa" value={etapa.titulo} onChange={(e) => handleEtapaChange(index, "titulo", e.target.value)} />
          <input type="text" placeholder="Descripción corta" value={etapa.descripcion} onChange={(e) => handleEtapaChange(index, "descripcion", e.target.value)} />
          <input type="file" className="file-input" onChange={(e) => handleArchivoChange(index, e.target.files[0])} />
          {etapa.archivoNombre && <span className="archivo-nombre">{etapa.archivoNombre}</span>}
          <button onClick={() => eliminarEtapa(index)} className="btn-delete">✖</button>
        </div>
      ))}

      <button onClick={agregarEtapa} className="btn-add">➕</button>

      <div className="btn-group">
        <button onClick={handleGuardar} className="btn-save">GUARDAR</button>
        <button onClick={() => navigate(-1)} className="btn-cancel">CANCELAR</button>
      </div>
    </div>
  );
};

export default CreateDefinition;
