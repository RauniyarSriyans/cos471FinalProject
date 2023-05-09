import Web3 from "web3";
<<<<<<< HEAD
import Voting from "./contracts/Voting.json";

export default async function GetWeb3() {
  try {
    // Check if the MetaMask extension is installed
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    // Request account access from the user
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a new Web3 instance using the MetaMask provider
    const web3 = new Web3(window.ethereum);

    // Get the network ID to deploy the contract to the correct network
    const networkId = await web3.eth.net.getId();

    // Get the deployed network from the contract JSON
    const deployedNetwork = Voting.networks[networkId];

    // If the contract isn't deployed to the current network, throw an error
    if (!deployedNetwork) {
      throw new Error(
        `Contract not deployed on network with id ${networkId}`
      );
    }

    // Create a new contract instance using the Web3 instance and the contract JSON
    const contract = new web3.eth.Contract(
      Voting.abi,
      deployedNetwork.address
    );

    // Get the accounts of the current user
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);

    // Return the Web3 instance, contract instance, and accounts
    return [web3, contract, accounts];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
=======
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
>>>>>>> b0ea8a44de5bfd88d6eec564f213dd9e64bd4892
