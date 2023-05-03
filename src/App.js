import { useState, useEffect } from "react";
import Web3 from "web3"
import Election from './contracts/Election.json';
import {Route, Routes, Router} from 'react-router-dom';
import LandingPage from "./LandingPage"


function App(): React.ReactNode {
  const [state, setState] = useState({web3:null, contract:null});
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const contract = new web3.eth.Contract(Election.abi, deployedNetwork.address);
      setState({web3:web3, contract: contract});


    }
    provider && template();
  }, []);

  useEffect(()=> {
    const {contract} = state;
    async function test(){
      const data = await contract.methods.sayHello().call();
      console.log(data);
    }
    contract && test();
  }, [state]);



  return (
    
   <div>
      <Routes>
      <Route exact path ="/" element={<LandingPage/>}/>
      
    </Routes>
   </div>
  );
}


export default App;
