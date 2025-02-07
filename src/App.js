import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard"; // Nueva pantalla del profesor/administrador
import CreateAssignment from "./CreateAssignment";
import FeedbackAssignment from "./FeedbackAssigment";
import EditAssignment from "./EditAssignment";
import CreateDefinition from "./CreateDefinition";
import DescriptionDefinition from "./DescriptionDefinition";

function App() {
  const [userRole, setUserRole] = useState(null); // Guardar el rol del usuario

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={userRole ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/createAssignment" element={userRole ? <CreateAssignment /> : <Navigate to="/" />} />
        <Route path="/feedback/:id" element={<FeedbackAssignment />} />
        <Route path="/editAssignment/:id" element={<EditAssignment />} />
        <Route path="/createDefinition" element={userRole ? <CreateDefinition /> : <Navigate to="/" />} />
        <Route path="/descriptionDefinition/:nombreDefinicion" element={<DescriptionDefinition />} />
      </Routes>
    </Router>
  );
}

export default App;
