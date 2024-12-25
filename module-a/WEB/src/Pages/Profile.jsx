import { useEffect, useState } from "react";
import Web3 from "web3";
import { useAppContext } from "../Components/AppContext";

function App() {
  const { account, setAccount, contractId } = useAppContext();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          alert("Нет доступных аккаунтов. Пожалуйста, подключите MetaMask.");
        }
      } else {
        alert("Пожалуйста, установите MetaMask!");
      }
    };
    loadWeb3();
  }, [setAccount]);

  useEffect(() => {
    const loadBalance = async () => {
      if (account && contractId) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyTokenABI, contractId);
        const balance = await contract.methods.balanceOf(account).call();
        setBalance(balance);
      }
    };
    loadBalance();
  }, [account, contractId]); // Зависимость от account и contractId

  const handleTransfer = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(MyTokenABI, contractId); // Используем contractId из контекста
    await contract.methods.transfer(recipient, amount).send({ from: account });
    alert("Перевод успешен!");
    setAmount("");
    setRecipient("");
  };

  return (
    <div>
      <h1>Мой токен DApp</h1>
      <p>Аккаунт: {account}</p>
      <p>Баланс: {balance} MTK</p>
      <h2>Перевод токенов</h2>
      <input
        type="text"
        placeholder="Адрес получателя"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Сумма"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Перевести</button>
    </div>
  );
}

export default App;
