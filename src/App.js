import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard"; // Nueva pantalla del profesor/administrador
import CreateAssignment from "./CreateAssignment";

function App() {
  const [userRole, setUserRole] = useState(null); // Guardar el rol del usuario

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={userRole ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/createAssignment" element={userRole ? <CreateAssignment /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
