import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// User components
import NavBar from "./Components/UserDashboard/NavBar";
import Hero from "./Components/UserDashboard/Hero";

// Admin component
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";


function App() {
  return (
    <Router>
      <Routes>
        {/* User Page */}
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

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
