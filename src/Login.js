import "./App.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Voting from "./contracts/Voting.json";
import Web3 from "web3";
import { getWeb3 } from "./GetWeb3.js";
import { Login } from "./Login.jsx";
import { Register } from "./Register.jsx";

export default function SignIn() {
  const [currentForm, setCurrentForm] = useState("login");
  const navigate = useNavigate();
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="bg-light d-flex flex-column min-vh-100 w-100 h-100">
      {currentForm === "login" ? (
        <Login onFormSwitch={toggleForm} className="w-100 h-100"/>
      ) : (
        <Register onFormSwitch={toggleForm} />
      )}
    </div>
  );
}
