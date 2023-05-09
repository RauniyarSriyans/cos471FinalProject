import { Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import VoterDashboard from "./VoterDashboard";
import Results from "./Results";

import Login from "./Login"
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <Routes>
      <Route exact path="/dashboard" element={<VoterDashboard />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
