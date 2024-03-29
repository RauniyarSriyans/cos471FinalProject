import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Voting from "./contracts/Voting.json";

export default function Results() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [candidatesVotes, setCandidatesVotes] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Connect to the Ethereum network and initialize the contract instance on component mount
  useEffect(() => {
    async function connectToWeb3() {
      let provider;

      // Check if the user has MetaMask or another Ethereum provider installed in their browser
      if (window.ethereum) {
        provider = window.ethereum;
      } else {
        // Use a local development network as a fallback
        provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
      }

      // If no provider is found, log an error message and return
      if (!provider) {
        setError("No Ethereum provider detected.");
        setLoading(false);
        return;
      }

      try {
        // Create a new web3 instance using the provider
        const web3 = new Web3(provider);
        // Get the network ID to deploy the contract to the correct network
        const networkId = await web3.eth.net.getId();
        // Get the deployed network from the contract JSON
        const deployedNetwork = Voting.networks[networkId];
        // If the contract isn't deployed to the current network, log an error message and return
        if (!deployedNetwork) {
          setError(
            `Contract not deployed to network with ID ${networkId}`
          );
          setLoading(false);
          return;
        }
        // Create a new contract instance using the web3 instance and the contract JSON
        const contract = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork.address
        );
        // Update the state with the web3 and contract instances and set isConnected to true
        setWeb3(web3);
        setContract(contract);
        setIsConnected(true);
      } catch (error) {
        setError("Error connecting to the Ethereum network.");
        setLoading(false);
        console.error(error);
      }
    }

    connectToWeb3();
  }, []);

  // Load the election results from the smart contract on component mount and whenever the contract instance changes
  useEffect(() => {
    async function loadResults() {
      if (!contract) return;

      try {
        const results = await contract.methods
          .getElectionResults()
          .call();
        setCandidatesVotes(results);
        const results1 = await contract.methods
          .getElectionCandidates()
          .call();
        setCandidates(results1);
        setLoading(false);
      } catch (error) {
        setError("Error loading election results.");
        setLoading(false);
        console.error(error);
      }
    }

    loadResults();
  }, [contract]);
  const handleDeVoteClick = async () => {
    navigate("/");
  };


  const handleLogout = async () => {
    localStorage.removeItem("ssn");
    navigate("/");
  };

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <header className="bg-success text-white">
        <div className="container d-flex justify-content-between align-items-center py-3">
        <button onClick = {handleDeVoteClick} className="btn btn-lg btn-success margin-auto">DeVote</button> 
          <h2 className="mb-0">A COS471 Project</h2>
        </div>
      </header>
      <main className="container flex-fill">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card my-5">
              <div className="card-body">
                <h5 className="card-title">Election Results</h5>
                <p className="card-text">
                  {candidates[0]}: {candidatesVotes[0]} votes
                </p>
                <p className="card-text">
                  {candidates[1]}: {candidatesVotes[1]} votes
                </p>
                <p className="card-text">
                  {candidates[2]}: {candidatesVotes[2]} votes
                </p>
                <button onClick={() => {navigate("/dashboard")}} className="btn btn-primary mr-9"
                style={{margin: "10px"}}>
                  Return to Dashboard
                </button>
                <button onClick={handleLogout} className="btn btn-primary ml-9"
                style={{margin: "10px"}}>
                  Log out
                </button>

              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-success text-white text-center py-3">
        <p>&copy; 2023 DeVote. All rights reserved.</p>
      </footer>
    </div>
  );
}
