import './LandingPage.css';
import { useState, useEffect } from "react";
import Web3 from "web3"
import './App.js'
import VoterDashboard from "./VoterDashboard";
import {useNavigate } from 'react-router-dom';
import Election from './contracts/Election.json';


export default function VoterDashBoard(): React.ReactNode {

  return (
    <div>
      <header className="header">
        <div className="left-section">
          <h2>VoterDashBoard</h2>
        </div>
      </header>
      <div class="main-text">
  <p>Welcome to VoterDashBoard</p>

</div>

    </div>
  );
};