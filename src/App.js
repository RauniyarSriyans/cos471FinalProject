import { useState, useEffect } from "react";
import Web3 from "web3"
import Election from './contracts/Election.json';
import {Route, Routes, Router} from 'react-router-dom';
import LandingPage from "./LandingPage"
import VoterDashboard from "./VoterDashboard"


function App(): React.ReactNode {

  return (
    
   <div>
      <Routes>
      <Route exact path ="/" element={<LandingPage/>}/>
      <Route exact path ="/VoterDashboard" element={<VoterDashboard/>}/>
    </Routes>
   </div>
  );
}


export default App;
