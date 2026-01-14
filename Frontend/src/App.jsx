import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./Components/Userdashboard/NavBar";
import Hero from "./Components/Userdashboard/Hero";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;

