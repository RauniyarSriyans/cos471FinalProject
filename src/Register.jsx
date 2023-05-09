import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
          .send({ from: accounts[0], gas: 6721975 });

        localStorage.setItem("ssn", enteredSSN);
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
