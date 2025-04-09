import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });

      const { access_token, courses } = response.data;

      if (access_token) {
        localStorage.setItem('jwt', access_token);
      }

      if (courses && courses.length > 0) {
        setCourses(courses);
      } else {
        alert("No estás inscrito en ningún curso.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión, verifica tus credenciales.");
    }
  };


  const handleCourseSelect = async (course_id, course_role) => {
    try {
      const res = await api.post("/auth/select_course", { course_id });
      const { access_token } = res.data;

      if (access_token) {
        localStorage.setItem("jwt", access_token);
        setUserRole(course_role);

        if (course_role === "professor" || course_role === "assistant") {
          navigate("/dashboard");
        } else if (course_role === "student") {
          navigate("/studentDashboard");
        } else {
          alert("Acceso denegado o usuario no reconocido.");
        }
      } else {
        alert("Error en la selección del curso.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al seleccionar el curso.");
    }
  };

  useEffect(() => {
    if (courses.length === 1) {
      const onlyCourse = courses[0];
      handleCourseSelect(onlyCourse.course_id, onlyCourse.course_role);
    }
  }, [courses]);

  return (
    <div>
      {courses.length === 0 ? (
        <div className="login-container">
          <div className="login-box">
            <h2 className="title">Bienvenid@ !</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="login-btn">INICIAR SESIÓN</button>
            </form>
          </div>
        </div>
      ) : courses.length > 1 ? (
        <div className="course-selection-container">
          <h2>Selecciona un curso</h2>
          <ul>
            {courses.map((course) => (
              <li key={course.course_id}>
                {course.course_name} - Rol: {course.course_role}
                <button
                  onClick={() =>
                    handleCourseSelect(course.course_id, course.course_role)
                  }
                >
                  Seleccionar
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Login;
