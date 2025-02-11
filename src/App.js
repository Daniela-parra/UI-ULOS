import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard"; // Nueva pantalla del profesor/administrador
import CreateAssignment from "./Components/CreateAssignment";
import FeedbackAssignment from "./Components/FeedbackAssigment";
import EditAssignment from "./Components/EditAssignment";
import CreateDefinition from "./Components/CreateDefinition";
import DescriptionDefinition from "./Components/DescriptionDefinition";
import StudentDashboard from "./Components/StudentDashboard";
import Detail from "./Components/Detail";

function App() {
  const [userRole, setUserRole] = useState(null); // Guardar el rol del usuario

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={userRole ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/studentDashboard" element={userRole === "estudiante" ? <StudentDashboard /> : <Navigate to="/" />} />
        <Route path="/createAssignment" element={userRole ? <CreateAssignment /> : <Navigate to="/" />} />
        <Route path="/feedback/:id" element={<FeedbackAssignment />} />
        <Route path="/editAssignment/:id" element={<EditAssignment />} />
        <Route path="/createDefinition" element={userRole ? <CreateDefinition /> : <Navigate to="/" />} />
        <Route path="/descriptionDefinition/:nombreDefinicion" element={<DescriptionDefinition />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
