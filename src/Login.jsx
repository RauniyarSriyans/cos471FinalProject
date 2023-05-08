
import "./App.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
import Web3 from 'web3'
export const Login = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [ssn, setSSN] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);


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
  useEffect(() => {
    connectWeb3();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(ssn);
    const enteredPass = e.target.ssn.value;
    
      const isRegistered = await contract.methods.hasRegistered(enteredPass).call();
      if (!isRegistered) {
        setErrorMessage("Unregistered or invalid SSN");
        console.log(errorMessage);
      }
      else {
        navigate("/dashboard");
      }

  };
  
    
    return (
        <>
        <form onSubmit={handleSubmit}>
            <label>SSN</label>
            <input value = {ssn} onChange = {(e) => setSSN(e.target.value)}type="password" placeholder="Please enter your SSN" id="ssn" name="ssn" />
            <button type = "submit">Log In</button>
            {errorMessage && <p>{errorMessage}</p>}
        </form>
        <button onClick = {() => props.onFormSwitch('register')}> Don't have an account? Register here</button>
        </>
    );
}

