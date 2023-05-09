import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Election from "./contracts/Voting.json";
import VoterDashboard from "./VoterDashboard";
import {getWeb3} from "./GetWeb3"

export default function LandingPage() {
  // State hooks to manage the web3 instance, contract instance, and connection status
  const [state, setState] = useState({web3:null, contract: null, accounts: []});

  const [isConnected, setIsConnected] = useState(false);

  // The useNavigate hook from react-router-dom to navigate to the VoterDashboard component
  const navigate = useNavigate();

  // function to connect to metamask
  const handleConnect = async () => {
    try {
      const { web3, contract, accounts } = await getWeb3();
      setState({ web3, contract, accounts });
      setIsConnected(true);
    } catch (err) {
      // Handle error while connecting
      console.error(err);
    }
  };


  const handleNav = async () => {
    navigate("/login");
  };
  useEffect (()=> {
    const {contract, accounts} = state;
    async function readData(){
      const name = await contract.methods.getElectionName().call();
      console.log(name);
      const elecRes = await contract.methods.getElectionResults().call();
      console.log(elecRes);
      const elecCand = await contract.methods.getElectionCandidates().call();
      console.log(elecCand);
      console.log(await contract.methods.register("Karim", "06/08/2002", "920243739").send({gas: 3000000, from: accounts[0]}));
      console.log(await contract.methods.vote("920243739", 1).send({gas: 3000000, from: accounts[0]}))
      console.log(await contract.methods.getElectionResults().call());
      const hasReg = await contract.methods.hasRegistered("920243739").call();
      console.log(hasReg);
    }
    contract && readData();
  },[state]);




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







