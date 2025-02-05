import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../Components/DataProvider";
import Web3 from "web3";
import abi from "../ContractData/abi.json";
import { byteCode } from "../ContractData/biteCode";

const Auth = () => {
  const {
    setSelectedAccount,
    setContract,
    ownerAddress,
    selectedAccount,
    contract,
  } = useData() || {};
  const navigate = useNavigate();

  const handleSignInButton = () => {
    if (selectedAccount && contract) navigate("/main");
  };

  useEffect(() => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => setSelectedAccount(accounts[0]));
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", (accounts) =>
      setSelectedAccount(accounts[0])
    );
  }, []);

  const deployContract = async () => {
    alert("Ожидайте, система запускается!!!");
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi);
      const deployTransaction = contract.deploy({
        data: byteCode,
      });
      const gasPrice = await web3.eth.getGasPrice();
      const options = {
        from: ownerAddress,
        gas: "9086221",
        gasPrice: gasPrice.toString(),
      };
      const deployedContract = await deployTransaction.send(options);
      console.log(
        "Contract deployed at address:",
        deployedContract.options.address
      );
      setContract(deployedContract);

      alert("Система запущена");
      console.log("Адрес владельца контракта - " + ownerAddress);
    } catch (error) {
      console.error("Ошибка при развертывании контракта:", error);
      alert(
        "Ошибка при развертывании контракта. Проверьте консоль для подробностей."
      );
    }
  };

  return (
    <div>
      <h1>Авторизация с помощью MetaMask</h1>
      <h2>Выбранный аккаунт - {selectedAccount}</h2>
      <div>---</div>
      <button onClick={handleSignInButton}>Войти</button>
      <button onClick={deployContract}>Запустить систему</button>
    </div>
  );
};

export default Auth;
