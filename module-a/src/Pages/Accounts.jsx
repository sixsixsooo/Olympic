import { useState, useEffect } from "react"; 
import abi from "../ContractData/abi.json"; 
import { contractGas, bytecode } from "../ContractData/data"; 
import Web3 from "web3";
import { useAppContext } from "../Components/AppContext";

const Accounts = () => {
  const [loading, setLoading] = useState(false);
  const { setContractId, contractId } = useAppContext(); 
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Запрашиваем доступ к учетным записям
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]); // Сохраняем первый аккаунт
      } else {
        alert("Пожалуйста, установите MetaMask!");
      }
    };

    initWeb3();
  }, []);

  const deployContract = async () => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(abi); 
      const deployObject = contract.deploy({ data: bytecode });
      const optionsObject = {
        from: account, // Используем аккаунт из MetaMask
        gas: contractGas,
        gasPrice: (await web3.eth.getGasPrice()).toString() 
      };
      const deployedContract = await deployObject.send(optionsObject);
      if (deployedContract.options.address) {
        console.log("Контракт успешно развернут:", deployedContract.options.address);
        setContractId(deployedContract.options.address);
      }
    } catch (error) {
      console.error("Ошибка деплоя:", error);
      alert("Ошибка деплоя");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Задеплоить Контракт</h3>
      <button onClick={deployContract} disabled={loading || !account}>Деплой контракта</button>
      {loading && <p>Загрузка...</p>}
      {contractId && <p>Адрес задеплоенного контракта: {contractId}</p>}
    </div>
  );
};

export default Accounts;