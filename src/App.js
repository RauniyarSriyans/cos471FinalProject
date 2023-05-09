import { Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./LandingPage";
import VoterDashboard from "./VoterDashboard";
import Signup from "./Signup";
import Results from "./Results";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route exact path="/dashboard" element={<VoterDashboard />} />
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
