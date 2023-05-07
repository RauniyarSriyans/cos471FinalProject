import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Election from "./contracts/Election.json";
import VoterDashboard from "./VoterDashboard";

export default function LandingPage() {
  // State hooks to manage the web3 instance, contract instance, and connection status
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // The useNavigate hook from react-router-dom to navigate to the VoterDashboard component
  const navigate = useNavigate();

  // Function to handle connecting to the Ethereum network
/*   const handleConnect = async () => {
    let provider;

    // Check if the user has MetaMask or another Ethereum provider installed in their browser
    if (window.ethereum) {
      provider = window.ethereum;
    } else {
      // Use a local development network as a fallback
      provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    }

    // If no provider is found, log an error message and return
    if (!provider) {
      console.error("No Ethereum provider detected.");
      return;
    }

    try {
      // Create a new web3 instance using the provider
      const web3 = new Web3(provider);
      // Get the network ID to deploy the contract to the correct network
      const networkId = await web3.eth.net.getId();
      // Get the deployed network from the contract JSON
      const deployedNetwork = Election.networks[networkId];
      // If the contract isn't deployed to the current network, log an error message and return
      if (!deployedNetwork) {
        console.error(`Contract not deployed to network with ID ${networkId}`);
        return;
      }
      // Create a new contract instance using the web3 instance and the contract JSON
      const contract = new web3.eth.Contract(
        Election.abi,
        deployedNetwork.address
      );
      // Update the state with the web3 and contract instances and set isConnected to true
      setWeb3(web3);
      setContract(contract);
      setIsConnected(true);
      // Navigate to the VoterDashboard component
      navigate("/VoterDashBoard");
    } catch (error) {
      console.error("Error connecting to the Ethereum network:", error);
    }
  }; */

  const handleNav = async () => {
    navigate("/login");
  };

  // Render the landing page JSX
  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <header className="bg-success text-white">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <h2 className="mb-0">DeVote</h2>
          <h2 className="mb-0">A COS471 Project</h2>
        </div>
      </header>
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h1 className="display-2">DeVote</h1>
          <p className="lead mb-5">Welcome to DeVote</p>
          {isConnected ? (
            <p>Placeholder for token</p>
          ) : (
            <button className="btn btn-lg btn-success" onClick={handleNav}>
              Login/Register
            </button>
          )}
        </div>
      </main>
      <footer className="bg-success text-white text-center py-3">
        <p>&copy; 2023 DeVote. All rights reserved.</p>
      </footer>
    </div>
  );
  
  
}
