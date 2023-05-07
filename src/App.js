import { Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import VoterDashboard from "./VoterDashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route exact path="/dashboard" element={<VoterDashboard />} />
      <Route exact path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
