import { useEffect, useState } from "react";
import { useData } from "../Components/DataProvider";

export const BalanceList = () => {
  const [gerdaAddress, setGerdaAddress] = useState("");
  const [krendelAddress, setKrendelAddress] = useState("");
  const [rtkAddress, setRtkAddress] = useState("");
  const [profiAddress, setProfiAddress] = useState("");
  const [gerdaBalance, setGerdaBalance] = useState("");
  const [krendelBalance, setKrendelBalance] = useState("");
  const [rtkBalance, setRtkBalance] = useState("");
  const [profiBalance, setProfiBalance] = useState("");
  const [userName, setUserName] = useState("");
  const { selectedAccount, contract } = useData() || {};

  useEffect(() => {
    fetchTokenAddresses();
    fetchUserName();
  }, [selectedAccount, contract]);

  const fetchTokenAddresses = async () => {
    if (contract && selectedAccount) {
      const gerda = await contract.methods.Gerda().call();
      setGerdaAddress(gerda.toString());
      const krendel = await contract.methods.Krendel().call();
      setKrendelAddress(krendel.toString());
      const rtk = await contract.methods.RTK().call();
      setRtkAddress(rtk.toString());
      const profi = await contract.methods.Profi().call();
      setProfiAddress(profi.toString());

      const gerdaBalance = await contract.methods
        .getBalance(gerda)
        .call({ from: selectedAccount });
      setGerdaBalance(gerdaBalance.toString().slice(0, -12) || 0);
      const krendelBalance = await contract.methods
        .getBalance(krendel)
        .call({ from: selectedAccount });
      setKrendelBalance(krendelBalance.toString().slice(0, -12) || 0);
      const rtkBalance = await contract.methods
        .getBalance(rtk)
        .call({ from: selectedAccount });
      setRtkBalance(rtkBalance.toString().slice(0, -12) || 0);
      const profiBalance = await contract.methods
        .getBalance(profi)
        .call({ from: selectedAccount });
      setProfiBalance(profiBalance.toString().slice(0, -12) || 0);
    }
  };

  const fetchUserName = async () => {
    try {
      const data = await contract.methods
        .returnUserName(selectedAccount)
        .call({ from: selectedAccount });
      setUserName(data);
      console.log(userName);
    } catch (error) {
      console.log(`Ошибка получения имени ${error}`);
    }
  };

  const handleGiveStartTokens = () => {
    const fetchGive = async () => {
      const result = await contract.methods
        .giveStartTokensToUsers(10000)
        .send({ from: selectedAccount });
      console.log(result);
      alert("Ожидайте, транзакция отправлена");
      fetchTokenAddresses();
    };
    fetchGive();
  };

  return (
    <div>
      <h1>Информация о балансе ваших токенов в системе</h1>
      <h1>Имя пользователя: {userName}</h1>
      <h4>Адрес токена GerdaCoin - {gerdaAddress}</h4>
      <h4>Адрес токена KrendelCoin - {krendelAddress}</h4>
      <h4>Адрес токена RTKCoin - {rtkAddress}</h4>
      <h4>Адрес токена ProfiCoin - {profiAddress}</h4>
      <div>---</div>
      <h3>Ваш баланс токена GerdaCoin - {gerdaBalance}</h3>
      <h3>Ваш баланс токена KrendelCoin - {krendelBalance}</h3>
      <h3>Ваш баланс токена RTKCoin - {rtkBalance}</h3>
      <h3>Ваш баланс токена ProfiCoin - {profiBalance}</h3>
      {userName === "Owner" && (
        <button onClick={handleGiveStartTokens}>
          Раздать стартовые токены пользователям
        </button>
      )}
    </div>
  );
};
