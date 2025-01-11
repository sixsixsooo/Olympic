import Web3 from "web3";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    await window.ethereum.enable();
  } catch (error) {
    console.error("MetaMask access denied");
  }
} else {
  console.error("Install MetaMask!");
}

export default web3;
