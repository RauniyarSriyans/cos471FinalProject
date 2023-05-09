import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Voting from "./contracts/Voting.json";
import VoterDashboard from "./VoterDashboard";
import {getWeb3} from "./GetWeb3"
import {
    PieChart,
    Pie,
    Tooltip,
    BarChart,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    Bar,
  } from "recharts";

export default function ElectionResults() {
    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
  
    // State hooks to manage the list of elections, selected election, list of candidates, selected candidate, and voter information
    const [election, setElection] = useState([]);
    const [candidates, setCandidates] = useState([]);

  
    // Function to connect to the Ethereum network and initialize the contract instance
    const connectWeb3 = async () => {
      let provider;
  
      // Check if the user has MetaMask or another Ethereum provider installed in their browser
      if (window.ethereum) {
        provider = window.ethereum;
        console.log("here1");
      } else {
        // Use a local development network as a fallback
        provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
          
        );
        console.log("here2");
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
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to the Ethereum network:", error);
      }
    };
  
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
        setElection([
            { name: candidate1, votes: candidate1Votes },
            { name: candidate2, votes: candidate2Votes },
            { name: candidate3, votes: candidate3Votes },
        ]);
        console.log(election);
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
      connectWeb3();
    }, []);
  
    // Load the list of elections from the smart contract on component mount and whenever the contract instance changes
    useEffect(() => {
      loadElection();
    }, [contract]);




  // Render the landing page JSX
  return (
    <div style={{ textAlign: "center" }}>
    <h1>Election Results</h1>
    <div className="App">
      <PieChart width={500} height={800}>
        <Pie
          dataKey="votes"
          isAnimationActive={false}
          data={election}
          cx={200}
          cy={200}
          outerRadius={150}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
      
    </div>
  </div>
);
}







