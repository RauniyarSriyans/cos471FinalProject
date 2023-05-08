import Web3 from "web3";
import Election from "./contracts/Voting.json";

export const getWeb3 = async () => {
  // Check if the MetaMask extension is installed
  if (window.ethereum) {
    try {

      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      if (!deployedNetwork) {
        throw new Error(`Contract not deployed on network with id ${networkId}`);
      }
      const contract = new web3.eth.Contract(Election.abi, deployedNetwork.address);
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      return { web3, contract, accounts };
    } catch (err) {

      console.error(err);
      throw err;
    }
  } else {

    throw new Error("Please install MetaMask!");
  }
};
