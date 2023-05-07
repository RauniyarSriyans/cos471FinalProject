import "./App.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Election from "./contracts/Election.json";
import Web3 from "web3";

export default function VoterDashboard() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // State hooks to manage the list of elections, selected election, list of candidates, selected candidate, and voter information
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voter, setVoter] = useState(null);

  // Function to connect to the Ethereum network and initialize the contract instance
  const connectWeb3 = async () => {
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
        console.error(
          `Contract not deployed to network with ID ${networkId}`
        );
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
    } catch (error) {
      console.error("Error connecting to the Ethereum network:", error);
    }
  };

  // Function to load the list of elections from the smart contract
  const loadElections = async () => {
    if (!contract) return;

    try {
      const numElections = await contract.methods
        .getNumElections()
        .call();
      const electionList = [];
      for (let i = 0; i < numElections; i++) {
        const election = await contract.methods.getElection(i).call();
        electionList.push(election);
      }
      setElections(electionList);
    } catch (error) {
      console.error(
        "Error loading elections from the smart contract:",
        error
      );
    }
  };

  // Function to load the list of candidates for the selected election from the smart contract
  const loadCandidates = async () => {
    if (!contract || !selectedElection) return;

    try {
      const electionID = selectedElection.electionID;
      const candidatesCount = selectedElection.candidates.length;
      const candidates = [];

      for (let i = 0; i < candidatesCount; i++) {
        const candidate = selectedElection.candidates[i];
        candidates.push(candidate);
      }

      setCandidates(candidates);
    } catch (error) {
      console.error(
        "Error loading candidates from the smart contract:",
        error
      );
    }
  };

  // Function to load the voter information from the smart contract
  const loadVoter = async () => {
    if (!contract || !web3) return;

    try {
      const accounts = await web3.eth.getAccounts();
      const voterId = accounts[0];
      const electionId = selectedElection?.id;
      const voter = await contract.methods
        .getVoter(electionId, voterId)
        .call();
      setVoter(voter);
    } catch (error) {
      console.error(
        "Error loading voter information from the smart contract:",
        error
      );
    }
  };

  // Connect to the Ethereum network and initialize the contract instance on component mount
  useEffect(() => {
    connectWeb3();
  }, []);

  // Load the list of elections from the smart contract on component mount and whenever the contract instance changes
  useEffect(() => {
    loadElections();
  }, [contract]);

  // Load the list of candidates for the selected election from the smart contract whenever the selected election changes
  useEffect(() => {
    loadCandidates();
  }, [selectedElection, contract]);

  // Load the voter information from the smart contract whenever the web3 instance or contract instance changes
  useEffect(() => {
    loadVoter();
  }, [web3, contract]);

  const handleVote = async () => {
    if (!contract || !selectedElection || selectedCandidate === null)
      return;

    try {
      const accounts = await web3.eth.getAccounts();
      const ssn = voter.ssn;
      const electionID = selectedElection.electionID;
      const optionIndex = selectedCandidate;
      await contract.methods
        .vote(ssn, electionID, optionIndex)
        .send({ from: accounts[0] });
      loadVoter();
    } catch (error) {
      console.error("Error voting:", error);
    }
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
                    {elections.map((election) => (
                      <li
                        key={election.electionID}
                        className={`list-group-item ${
                          election.electionID ===
                          selectedElection?.electionID
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setSelectedElection(election)}
                      >
                        {election.name}
                      </li>
                    ))}
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
                  <h5 className="mb-0">Voter Information</h5>
                </div>
                <div className="card-body">
                  <p>Name: {voter?.name}</p>
                  <p>SSN: {voter?.ssn}</p>
                  <p>Has Voted: {voter?.hasVoted ? "Yes" : "No"}</p>
                </div>
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
