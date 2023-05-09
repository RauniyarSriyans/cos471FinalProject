import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
<<<<<<< HEAD
import Web3 from "web3";
import GetWeb3 from "./GetWeb3";
import "./App.js";
export const Register = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [ssn, setSSN] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // use getWeb3 utility to get the user's web3 instance
    const init = async () => {
      try {
        // Get the web3 instance and contract instance from GetWeb3
        const [web3, contract, accounts] = await GetWeb3();
        // Update the state variables
        setWeb3(web3);
        setContract(contract);
        setAccounts(accounts);
  
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const validateForm = (enteredName, enteredDate, enteredSSN) => {
    if (!/^\d{3}-\d{2}-\d{4}$/.test(enteredSSN)) {
      setErrorMessage("Invalid SSN");
      return false;
    }
    if (enteredName === "") {
      setErrorMessage("Name field cannot be empty");
      return false;
    }
    if (enteredDate === "") {
      setErrorMessage("Date of Birth field cannot be empty");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredName = e.target.name.value;
    const enteredDate = e.target.dob.value;
    const enteredSSN = e.target.ssn.value;

    if (!validateForm(enteredName, enteredDate, enteredSSN)) {
      return;
    }

    try {
      const isRegistered = await contract.methods
        .hasRegistered(enteredSSN)
        .call();
      if (isRegistered) {
        setErrorMessage(
          "An account with this SSN already exists. Please sign in."
        );
      } else {
        await contract.methods
          .register(enteredName, enteredDate, enteredSSN)
          .send({ from: accounts[0] });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-light d-flex flex-column min-vh-100 w-100 h-100">
      <div className="container mt-5">
        <header className="bg-success text-white py-3">
          <div className="container d-flex justify-content-between align-items-center">
            <h2 className="mb-0">DeVote</h2>
            <h2 className="mb-0">A COS471 Project</h2>
          </div>
        </header>
        <div className="container">
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                placeholder="Date of Birth"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ssn">SSN</label>
              <input
                id="ssn"
                name="ssn"
                type="text"
                placeholder="SSN"
                value={ssn}
                onChange={(e) => setSSN(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Sign up
            </button>
            {errorMessage && (
              <p className="text-danger mt-3">{errorMessage}</p>
            )}
          </form>
          <div className="mt-4">
            <p>
              Already have an account?{" "}
              <button
                onClick={() => props.onFormSwitch("login")}
                className="btn btn-link"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
        <footer className="bg-success text-white text-center py-3">
          <p>&copy; 2023 DeVote. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
=======
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
      const [accounts, setAccounts] = useState([]);
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
          const accounts = await web3.eth.getAccounts()
          // Update the state with the web3 and contract instances and set isConnected to true
          setWeb3(web3);
          setContract(contract);
          setAccounts(accounts);
          setIsConnected(true);
        } catch (error) {
          console.error("Error connecting to the Ethereum network:", error);
        }
      };
      useEffect(() => {
        connectWeb3();
      }, []);
      const failureCallBack = (error)=>{
         console.log("error");
        }
        const successCallBack = async (Name, DOB, SSN)=>{
          console.log("success");
          setShowErrorMsg(false);
          setErrorMessage(null);
          await contract.methods.register(Name,DOB, SSN).send({from: accounts[0]});
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
            setErrorMessage("Please fix errors above.")
            error = 1;
        }
        if (enteredName === ""){
            document.getElementById('name').placeholder = "Name field cannot be empty";
            setErrorMessage("Please fix errors above.")
            error = 1;
        }
        if (enteredDate === "") {
            document.getElementById('dob').placeholder = "Date of birth field cannot be empty";
            setErrorMessage("Please fix errors above.");
            error = 1;
        }
        const isRegistered = await contract.methods.hasRegistered(enteredSSN).call();
        if (isRegistered) {
          setErrorMessage("An account with this SSN already exists. Please sign in.");
          error = 1;
          console.log(errorMessage);
        }

        error !== 0 ? failureCallBack(errorMessage) : successCallBack(enteredName, enteredDate, enteredSSN);

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
>>>>>>> b0ea8a44de5bfd88d6eec564f213dd9e64bd4892
