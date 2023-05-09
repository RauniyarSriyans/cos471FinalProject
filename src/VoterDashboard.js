import "./App.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
import Web3 from "web3";

export default function VoterDashboard() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  // State hooks to manage the list of elections, selected election, list of candidates, selected candidate, and voter information
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // Function to load the list of elections from the smart contract
  async function loadElection() {
    try {
      const name = await contract.methods.getElectionName().call();
      console.log(name);
      const electionCandidates = await contract.methods
        .getElectionCandidates()
        .call();
      const candidate1 = electionCandidates[0];
      const candidate2 = electionCandidates[1];
      const candidate3 = electionCandidates[2];

      const electionResults = await contract.methods
        .getElectionResults()
        .call();
      const candidate1Votes = electionResults[0];
      const candidate2Votes = electionResults[1];
      const candidate3Votes = electionResults[2];
      setElection({
        name,
        candidates: [
          { name: candidate1, votes: candidate1Votes },
          { name: candidate2, votes: candidate2Votes },
          { name: candidate3, votes: candidate3Votes },
        ],
      });
      setCandidates([candidate1, candidate2, candidate3]);
    } catch (err) {
      console.error(
        "Error loading election from the smart contract:",
        err
      );
    }
  }

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
          "http://localhost:7545"
        );
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
        const deployedNetwork = Voting.networks[networkId];
        // If the contract isn't deployed to the current network, log an error message and return
        if (!deployedNetwork) {
          console.error(
            `Contract not deployed to network with ID ${networkId}`
          );
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
      } catch (err) {
        // If an error occurs, log it and return
        console.error(err);
        return;
      }
    }

    connectToWeb3();
  }, []);

  // Load the list of elections from the smart contract on component mount and whenever the contract instance changes
  useEffect(() => {
    loadElection();
  }, [contract]);

  useEffect(() => {
    async function loadHasVoted() {
      if (!contract) return;
      if (localStorage.getItem("ssn") === null) return;
      try {
        const hasVoted = await contract.methods
          .hasVoted(localStorage.getItem("ssn"))
          .call();
        setHasVoted(hasVoted);
      } catch (err) {
        console.error(
          "Error loading voter information from the smart contract:",
          err
        );
      }
      
    }
    loadHasVoted();
  }, [contract]);
  // Load the voter information from the smart contract whenever the web3 instance or contract instance changes

  const handleVote = async () => {
    if (!contract || !election || selectedCandidate === null) return;
    if (localStorage.getItem("ssn") === null) {
      setErrorMessage("Please enter your SSN by loging in again.");
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      await contract.methods
        .vote(localStorage.getItem("ssn"), selectedCandidate + 1)
        .send({ from: account });
      navigate("/results");
    } catch (err) {
      setErrorMessage("You have already voted for this election.");
      console.error("Error submitting vote:", err);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("ssn");
    navigate("/");
  };

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <header className="bg-success text-white">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <h2 className="mb-0">DeVote</h2>
          <h2 className="mb-0">A COS471 Project</h2>
        </div>
      </header>
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Elections</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {election && (
                      <li className="list-group-item">
                        {election.name}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Candidates</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {candidates.map((candidate, index) => (
                      <li
                        key={index}
                        className={`list-group-item ${
                          index === selectedCandidate ? "active" : ""
                        }`}
                        onClick={() => setSelectedCandidate(index)}
                      >
                        {candidate}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Vote</h5>
                </div>
                <div className="card-body">
                {hasVoted && (
                    <button onClick={() => navigate("/results")} className="btn btn-primary"
                    style={{margin: "10px"}}>
                      Results
                    </button>
                  ) }
                {!hasVoted && (
                    <button onClick={handleVote} className="btn btn-primary"
                    style={{margin: "10px"}}>
                      Submit Vote
                    </button>
                  )}
                <button onClick={handleLogout} className="btn btn-primary"
                style={{margin: "10px"}}>
                  Log out
                </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-4">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
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

