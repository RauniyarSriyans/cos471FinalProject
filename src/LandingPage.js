import './LandingPage.css';
import { useState, useEffect } from "react";
import Web3 from "web3"
import './App.js'
import VoterDashboard from "./VoterDashboard";
import {useNavigate } from 'react-router-dom';
import Election from './contracts/Election.json';


export default function LandingPage(): React.ReactNode {
  const [state, setState] = useState({web3:null, contract:null});
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const handleConnect = () => {
    
        /*
    if (window.ethereum) {
      provider = window.ethereum;
      console.log("1");
    } else if (window.web3){
      provider = window.web3.currentProvider;
      console.log("2");
    }
    else{*/
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
  //}
    async function template(){
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const contract = new web3.eth.Contract(Election.abi, deployedNetwork.address);
      console.log(contract);

      setState({web3:web3, contract: contract});
      setIsConnected(true);
      navigate('/VoterDashBoard');
    } 
    provider && template();
  }

  useEffect(()=> {
    const {contract} = state;
    async function test(){
      const data = await contract.methods.sayHello().call();
      console.log(data);
    }
    contract && test();
  }, [state.contract]);

  

  return (
    <div>
      <header className="header">
        <div className="left-section">
          <h2>DeVote</h2>
        </div>
        <div className='right-section'>
            <h2>A COS471 Project</h2>
        </div>
      </header>
      <div class="main-text">
  <p>Welcome to</p>
</div>
      <div class="center-text">
  <p>DeVote</p>
</div>
<div>

    {isConnected ? (
      <p>Placeholder for token</p>
    ) : (
      <button onClick={handleConnect}>Connect</button>
    )}
  </div>


    </div>
  );
};
