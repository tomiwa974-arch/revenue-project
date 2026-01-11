import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./Components/UserDashboard/NavBar";
import Hero from "./Components/UserDashboard/Hero";

import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Hero />
          </>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

