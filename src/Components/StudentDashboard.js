import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import '../Styles/Dashboard.css'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [cursos, setCursos] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [asignaciones, setAsignaciones] = useState([])
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null)

  // Obtiene los cursos al montar el componente
  useEffect(() => {
    api
      .get('/courses')
      .then((response) => {
        const coursesData = response.data
        setCursos(coursesData)
        if (coursesData.length > 0) {
          setCursoSeleccionado(coursesData[0])
        }
      })
      .catch((error) => {
        console.error('Error al obtener los cursos:', error)
      })
  }, [])

  // Cada vez que se selecciona un curso, se obtienen sus asignaciones
  useEffect(() => {
    if (cursoSeleccionado) {
      api
        .get(`/courses/${cursoSeleccionado.id}/assignments`)
        .then((response) => {
          setAsignaciones(response.data)
        })
        .catch((error) => {
          console.error('Error al obtener asignaciones:', error)
        })
    }
  }, [cursoSeleccionado])

  const handleVerDetalle = () => {
    if (tareaSeleccionada) {
      navigate(`/detail/${tareaSeleccionada.id}`)
    }
  }

  return (
    <div className='dashboard-container'>
      <aside className='sidebar'>
        <h3>Cursos</h3>
        <ul>
          {cursos.map((curso) => (
            <li
              key={curso.id}
              className={curso === cursoSeleccionado ? 'active' : ''}
              onClick={() => setCursoSeleccionado(curso)}
            >
              {curso.course_name}
            </li>
          ))}
        </ul>
      </aside>

      <main className='content'>
        <header>
          <h1>Asignaciones - {cursoSeleccionado?.course_name}</h1>
          <button className='logout-btn' onClick={() => navigate('/')}>
            Cerrar sesión
          </button>
        </header>

        <table>
          <thead>
            <tr>
              <th>Asignación</th>
              <th>Fecha Límite</th>
              <th>Estado Parser</th>
              <th>Estado Executor</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((asignacion) => (
              <tr
                key={asignacion.id}
                className={
                  tareaSeleccionada?.id === asignacion.id ? 'selected' : ''
                }
                onClick={() => setTareaSeleccionada(asignacion)}
              >
                <td>{asignacion.assignment_name}</td>
                <td>{asignacion.assignment_end_date}</td>
                <td>{asignacion.estadoParser}</td>
                <td>{asignacion.estadoExecutor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="botones-container">
          <button className="detail-btn" onClick={handleVerDetalle} disabled={!tareaSeleccionada}>
            VER DETALLE
          </button>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
