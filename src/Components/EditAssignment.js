import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/CreateAssignment.css";
import api from "../api";

const EditAssignment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [definicionId, setDefinicionId] = useState("");
  const [definiciones, setDefiniciones] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resAsignacion = await api.get(`/assignments/${id}`)
        const asignacion = resAsignacion.data

        setTitulo(asignacion.assignment_name)
        setDescripcion(asignacion.assignment_description)
        setFechaInicio(asignacion.assignment_start_date.slice(0, 16))
        setFechaFin(asignacion.assignment_end_date.slice(0, 16))
        setDefinicionId(asignacion.task_definition.id)

        const resDefiniciones = await api.get('/task-definitions')
        setDefiniciones(resDefiniciones.data)
      } catch (err) {
        console.error('Error al cargar datos:', err)
        alert('Error al cargar la asignación.')
      }
    }

    fetchDatos()
  }, [id])

  const handleDefinicionChange = (e) => {
    const valor = e.target.value;
    if (valor === "crear-nueva") {
      navigate("/createDefinition");
    } else {
      setDefinicionId(valor);
    }
  };

  const handleGuardar = async () => {
    if (!titulo || !descripcion || !fechaInicio || !fechaFin || !definicionId) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      await api.put(`/assignments/${id}`, {
        assignment_name: titulo,
        assignment_description: descripcion,
        assignment_start_date: fechaInicio,
        assignment_end_date: fechaFin,
        task_definition_id: parseInt(definicionId),
      })

      alert('Asignación actualizada correctamente.')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error al actualizar asignación:', error)
      if (error.response?.status === 400) {
        alert(
          error.response.data.detail ||
            'No se puede actualizar la asignación porque ya tiene envíos.'
        )
      } else {
        alert('Ocurrió un error al guardar los cambios.')
      }
    }
  }

  return (
    <div className="crear-asignacion-container">
      <h1>Editar Asignación</h1>

      <label>Título</label>
      <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

      <label>Descripción</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <label>Fecha de Inicio</label>
      <input
        type='datetime-local'
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
      />

      <label>Fecha Límite</label>
      <input
        type='datetime-local'
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
      />

      <label>Definición</label>
      <div className="definicion-container">
        <select value={definicionId} onChange={handleDefinicionChange}>
          <option value="">Seleccione un tipo</option>
          {definiciones.map((def) => (
            <option key={def.id} value={def.id}>
              {def.definition_name}
            </option>
          ))}
        </select>
      </div>

      <div className="btn-group">
        <button onClick={handleGuardar}>Guardar</button>
        <button className="cancelar" onClick={() => navigate("/dashboard")}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditAssignment;
