import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Voting from "./contracts/Voting.json";
import Web3 from "web3";
import GetWeb3 from "./GetWeb3";
export const Login = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [ssn, setSSN] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredSSN = e.target.ssn.value;
    try {
      // Check if the MetaMask extension is installed and request account access from the user
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Check if the entered SSN is valid and registered in the contract
      if (!/^\d{3}-\d{2}-\d{4}$/.test(enteredSSN)) {
        throw new Error("Invalid SSN");
      }

      // Check if the entered SSN is registered in the contract
      const isRegistered = await contract.methods
        .hasRegistered(enteredSSN)
        .call();

      if (!isRegistered) {
        throw new Error("Unregistered SSN. Please sign up.");
      }
      navigate("/dashboard");
    } catch (err) {
      // If an error occurs, set the error message and show the error component
      setErrorMessage(err.message);
      setShowErrorMsg(true);
      console.error(err);
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ssn">SSN</label>
            <input
              className="form-control"
              value={ssn}
              onChange={(e) => setSSN(e.target.value)}
              type="text"
              placeholder="Please enter your SSN"
              id="ssn"
              name="ssn"
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}

          <button className="btn btn-primary mt-3" type="submit">
            Log In
          </button>
        </form>

        <p className="mt-3">
          Don't have an account?{" "}
          <button
            className="btn btn-outline-primary"
            onClick={() => props.onFormSwitch("register")}
          >
            Register here
          </button>
        </p>

        <footer className="bg-success text-white text-center py-3">
          <p>&copy; 2023 DeVote. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
