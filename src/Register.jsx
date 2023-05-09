import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
import Web3 from 'web3'
import "./App.js";
export const Register = (props) => {
      const [name, setName] = useState("");
      const [date, setDate] = useState("");
      const navigate = useNavigate();
      const [errorMessage, setErrorMessage] = useState("")
      const [showErrorMsg, setShowErrorMsg] = useState(false)
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
      const failureCallBack = (error)=>{
         setErrorMessage(error);
         setShowErrorMsg(true);
         console.log("error");
        }
        const successCallBack = ()=>{
          console.log("success");
          setShowErrorMsg(false);
          setErrorMessage(null);
          navigate("/dashboard");

        }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let error = 0;
        const enteredSSN = e.target.ssn.value;
        const enteredName = e.target.name.value;
        const enteredDate = e.target.dob.value;
        if (!/^\d{3}-\d{2}-\d{4}$/.test(enteredSSN)) {
            document.getElementById('ssn').placeholder = "Invalid SNN";
            error = 1;
        }
        if (enteredName === ""){
            document.getElementById('name').placeholder = "Name field cannot be empty";
            error = 1;
        }
        if (enteredDate === "") {
            document.getElementById('dob').placeholder = "Date of birth field cannot be empty";
            error = 1;
        }
        const isRegistered = await contract.methods.hasRegistered(enteredSSN).call();
        if (isRegistered) {
          setErrorMessage("An account with this SSN already exists. Please sign in.");
          error = 1;
          console.log(errorMessage);
        }

        error !== 0 ? failureCallBack("Please fix errors above") : successCallBack()

      }
        
    return (
        <>
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input value = {name} onChange = {(e) => setName(e.target.value)} type="text" placeholder="Full Name" id="name" name="name" />
            <label>Date of Birth</label>
            <input value = {date}onChange = {(e) => setDate(e.target.value)}type="date" placeholder="Date of Birth" id="dob" name="dob" />
            <label>SSN</label>
            <input value = {ssn} onChange = {(e) => setSSN(e.target.value)}type="text" placeholder="SSN" id="ssn" name="ssn" />
            <button type = "submit">Sign up</button>
            {errorMessage && <p>{errorMessage}</p>}
        </form>
        <p>Already have an account? <button onClick = {() => props.onFormSwitch('login')}>Login here</button></p>
        </>
    );
}
