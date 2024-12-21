import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { contractDeployAddress } from '../ContractData/data';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    };

    loadWeb3();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      if (account) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyTokenABI, contractDeployAddress);
        const balance = await contract.methods.balanceOf(account).call();
        setBalance(balance);
      }
    };

    loadBalance();
  }, [account]);

  const handleTransfer = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(MyTokenABI, contractDeployAddress);
    await contract.methods.transfer(recipient, amount).send({ from: account });
    alert('Transfer successful!');
    setAmount('');
    setRecipient('');
  };

  return (
    <div>
      <h1>My Token DApp</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance} MTK</p>
      <h2>Transfer Tokens</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default App;