import { useState, useEffect } from "react";
import Election from "../build/contracts/Election.json";
import TruffleContract from 'truffle-contract';
import Web3 from "web3/dist/web3.min"
import {Route, Routes, Router} from 'react-router-dom';
import LandingPage from "./LandingPage"

function App(): React.ReactNode {

  const [account, setAccount] = useState(null);
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const electionContract = await getContract(web3);


        setAccount(accounts[0]);
 
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const getWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = window.ethereum;
      await provider.enable();
      return new Web3(provider);
    } else {
      return new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
  };

  const getContract = async (web3) => {
    const contract = TruffleContract(Election);
    contract.setProvider(web3.currentProvider);
    return contract.deployed();
  };

  return (
    
   <div>
      <Routes>
      <Route exact path ="/" element={<LandingPage/>}/>
      
    </Routes>
   </div>
  );
}

export default App;
