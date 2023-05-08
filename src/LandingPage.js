import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Voting from "./contracts/Voting.json";
import VoterDashboard from "./VoterDashboard";

export default function LandingPage() {
  // State hooks to manage the web3 instance, contract instance, and connection status
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // The useNavigate hook from react-router-dom to navigate to the VoterDashboard component
  const navigate = useNavigate();

  // function to connect to metamask
  const handleConnect = async () => {
    // Check if the MetaMask extension is installed
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // Create a new web3 instance using the provider
        const web3 = new Web3(window.ethereum);
        // Get the contract instance
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];
        if (!deployedNetwork) {
          throw new Error(`Contract not deployed on network with id ${networkId}`);
        }
        const contract = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork.address
        );
        // Update state with the web3 and contract instances, and set isConnected to true
        setWeb3(web3);
        setContract(contract);
        setIsConnected(true);
      } catch (err) {
        // Handle error while connecting
        console.error(err);
      }
    } else {
      // Handle error if MetaMask extension is not installed
      alert("Please install MetaMask!");
    }
  };

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
          <h1 className="display-1 font-weight-bold">DeVote</h1>
          <h2 className="lead mb-5">Welcome to DeVote</h2>
          <br></br>
          <p className="display-15 font-weight-bold mx-3">
            Introducing DeVote, a decentralized voting platform that
            leverages blockchain technology to provide a secure and
            transparent voting process. With DeVote, users can
            participate in democratic decision-making without the need
            for intermediaries or centralized institutions. Built on the
            Ethereum blockchain, DeVote uses smart contracts to automate
            the voting process, ensuring that each vote is recorded
            accurately and transparently. This eliminates the potential
            for fraud or manipulation, as each vote is verified by a
            decentralized network of nodes.
          </p>
          <br></br>
          <br></br>
          <h3>
            For verification, please connect to a Metamask account and
            have the following information with you.
          </h3>
          <ol class="list-group-numbered">
            <li class="list-group-item">Name</li>
            <li class="list-group-item">SSN/ITIN Number</li>
            <li class="list-group-item">Date of Birth</li>
          </ol>
          <br></br>
          <br></br>
          <br></br>
          {isConnected ? (
            <button
              className="btn btn-lg btn-primary margin-auto"
              onClick={handleNav}
            >
              Signup/Login
            </button>
          ) : (
            <button
              className="btn btn-lg btn-success margin-auto"
              onClick={handleConnect}
            >
              Connect
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
