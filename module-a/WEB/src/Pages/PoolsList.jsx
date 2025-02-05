import { useEffect, useRef, useState } from "react";
import { useData } from "../Components/DataProvider";

const PoolsList = () => {
  const { contract, selectedAccount } = useData() || {};
  const [poolsList, setPoolsList] = useState([]);
  const [poolName, setPoolName] = useState("");
  const [poolOwner, setPoolOwner] = useState("");
  const [firstTokenReserve, setFirstTokenReserve] = useState("");
  const [secondTokenReserve, setSecondTokenReserve] = useState("");
  const [poolNames, setPoolNames] = useState("");
  const [poolAddress, setPoolAddreses] = useState("");

  const [firstTokenAddress, setFirstTokenAddress] = useState("");
  const [secondTokenAddress, setSecondTokenAddress] = useState("");
  const [firstTokenPrice, setFirstTokenPrice] = useState("");
  const [secondTokenPrice, setSecondTokenPrice] = useState("");
  const [lpAddress, setLpAddress] = useState("");
  const [startingEthRatio, setStartingEthRatio] = useState("");

  const [gerdaAddress, setGerdaAddress] = useState("");
  const [krendelAddress, setKrendelAddress] = useState("");
  const [rtkAddress, setRtkAddress] = useState("");
  const [profiAddress, setProfiAddress] = useState("");

  const poolAddressNameRef = useRef(null);
  const poolAddressOwnerRef = useRef(null);
  const poolAddressReserveRef = useRef(null);
  const poolAddressTradeRef = useRef(null);
  const valueToTradeRef = useRef(null);
  const tradeMethodRef = useRef(null);
  const poolAddressForLiqRef = useRef(null);
  const tokenForLiqRef = useRef(null);
  const valueToLiqRef = useRef(null);

  const fetchPools = async () => {
    try {
      const addresses = await contract.methods.getAllPoolsAddress().call();
      setPoolAddreses(addresses);

      const names = await contract.methods.getAllPoolnames(addresses).call();
      setPoolNames(names);
    } catch (error) {
      console.error(`Ошибка получения пулов ${error}`);
    }
  };

  const fetchPoolsList = async () => {
    if (contract) {
      const result = await contract.methods.getAllPoolsAddress().call();
      setPoolsList(result);
    }
  };

  const fetchCoinAddresses = async () => {
    try {
      const gerda = await contract.methods.Gerda().call();
      const krendel = await contract.methods.Krendel().call();
      const rtk = await contract.methods.RTK().call();
      const profi = await contract.methods.Profi().call();
      setGerdaAddress(gerda.toString());
      setKrendelAddress(krendel.toString());
      setRtkAddress(rtk.toString());
      setProfiAddress(profi.toString());
    } catch (error) {
      console.error(`Ошибка получения коинов ${error}`);
    }
  };
  useEffect(() => {
    fetchCoinAddresses();
    fetchPoolsList();
    fetchPools();
  }, [contract]);

  const handleCreatePool = async () => {
    try {
      alert("Пул создаётся");
      await contract.methods
        .createPool(
          poolName,
          firstTokenAddress,
          secondTokenAddress,
          firstTokenPrice,
          secondTokenPrice,
          lpAddress,
          startingEthRatio
        )
        .send({ from: selectedAccount });
      fetchPools();
    } catch (error) {
      console.error(`Ошибка при создании пула ${error}`);
      alert(`Ошибка при создании пула`);
    }
  };

  const handleClickPoolName = () => {
    const fetchPoolName = async () => {
      if (contract && poolAddressNameRef.current) {
        const result = await contract.methods
          .getPoolName(poolAddressNameRef.current.value)
          .call();
        const splitNames = result.split("-");
        const modifiedResult = `1-${splitNames[0]};2-${splitNames[1]}`;
        alert("Ожидайте, транзакция отправлена");
        setPoolName(modifiedResult);
      }
    };
    fetchPoolName();
  };

  const handleClickPoolOwner = () => {
    const fetchPoolOwner = async () => {
      if (contract && poolAddressOwnerRef.current) {
        const result = await contract.methods
          .getPoolOwner(poolAddressOwnerRef.current.value)
          .call();
        alert("Ожидайте, транзакция отправлена");
        setPoolOwner(result);
      }
    };
    fetchPoolOwner();
  };

  const handleClickPoolReserve = () => {
    const fetchPoolReserve = async () => {
      if (contract && poolAddressReserveRef.current) {
        const firstTokenResult = await contract.methods
          .getFirstTokenReserve(poolAddressReserveRef.current.value)
          .call();
        setFirstTokenReserve(firstTokenResult.toString().slice(0, -12));
        const secondTokenResult = await contract.methods
          .getSecondTokenReserve(poolAddressReserveRef.current.value)
          .call();
        setSecondTokenReserve(secondTokenResult.toString().slice(0, -12));
        alert("Ожидайте, транзакция отправлена");
      }
    };
    fetchPoolReserve();
  };

  const handleClickTrade = () => {
    const fetchPoolTrade = async () => {
      if (
        contract &&
        poolAddressTradeRef.current &&
        selectedAccount &&
        valueToTradeRef.current
      ) {
        if (tradeMethodRef.current) {
          if (tradeMethodRef.current.value === "firstToSecond") {
            console.log({
              selectedAccount,
              poolAddress: poolAddressTradeRef.current.value,
              value: valueToTradeRef.current.value,
            });

            const result = await contract.methods
              .tradeFirstToSecond(
                poolAddressTradeRef.current.value,
                Number(valueToTradeRef.current.value),
                selectedAccount
              )
              .send({ from: selectedAccount });

            console.log(result);
            alert("Ожидайте, транзакция отправлена");
          } else if (tradeMethodRef.current.value === "secondToFirst") {
            const result = await contract.methods
              .tradeSecondToFirst(
                poolAddressTradeRef.current.value,
                valueToTradeRef.current.value,
                selectedAccount
              )
              .send({ from: selectedAccount });

            console.log(result);
            alert("Ожидайте, транзакция отправлена");
          }
        }
      }
    };
    fetchPoolTrade();
  };

  const handleAddLiq = async () => {
    if (
      selectedAccount &&
      contract &&
      poolAddressForLiqRef.current &&
      valueToLiqRef.current &&
      tokenForLiqRef.current
    ) {
      if (tokenForLiqRef.current.value === "first") {
        const result = await contract.methods
          .addFirstTokenLiquidity(
            poolAddressForLiqRef.current.value,
            valueToLiqRef.current.value
          )
          .send({ from: selectedAccount });
        console.log(result);
      } else if (tokenForLiqRef.current.value === "second") {
        alert("Ожидайте, транзакция отправлена");
        const result = await contract.methods
          .addSecondTokenLiquidity(
            poolAddressForLiqRef.current.value,
            valueToLiqRef.current.value
          )
          .send({ from: selectedAccount });
        console.log(result);
        alert("Ожидайте, транзакция отправлена");
      }
    }
  };

  return (
    <div>
      <h1>Информация о существующих пулах</h1>
      <h3>Узнать пару токенов, которые обмениваются в пуле</h3>
      <input
        className="form-control"
        ref={poolAddressNameRef}
        type="text"
        placeholder="Введите адрес пула"
      />
      <h4>Пара токенов: {poolName}</h4>
      <button onClick={handleClickPoolName}>Узнать пару</button>

      <h3>Узнать адрес владельца пула</h3>
      <input
        className="form-control"
        ref={poolAddressOwnerRef}
        type="text"
        placeholder="Введите адрес пула"
      />
      <h4>Адрес владельца пула: {poolOwner}</h4>
      <button onClick={handleClickPoolOwner}>Узнать владельца</button>

      <h3>Узнать резервы каждого токена в пуле</h3>
      <input
        className="form-control"
        ref={poolAddressReserveRef}
        type="text"
        placeholder="Введите адрес пула"
      />
      <h4>Резерв первого токена: {firstTokenReserve}</h4>
      <h4>Резерв второго токена: {secondTokenReserve}</h4>
      <button onClick={handleClickPoolReserve}>Узнать резервы</button>

      <h3>Обменять токены в пуле</h3>
      <select className="form-control" ref={poolAddressTradeRef}>
        <option value="none">Выберите пул</option>
        {poolsList.map((pool, index) => (
          <option key={index} value={pool}>
            {pool}
          </option>
        ))}
      </select>
      <select className="form-control" ref={tradeMethodRef}>
        <option value="none">Выберите какой токен обменять</option>
        <option value="firstToSecond">Первый на второй</option>
        <option value="secondToFirst">Второй на первый</option>
      </select>
      <input
        className="form-control"
        ref={valueToTradeRef}
        type="number"
        placeholder="Количество"
      />
      <button onClick={handleClickTrade}>Обменять</button>

      <h3>Поддержать ликвидность в пуле</h3>
      <select className="form-control" ref={poolAddressForLiqRef}>
        <option value="none">Выберите пул</option>
        {poolsList.map((pool, index) => (
          <option key={index} value={pool}>
            {pool}
          </option>
        ))}
      </select>
      <select className="form-control" ref={tokenForLiqRef}>
        <option value="none">
          Выберите, в какой токен хотите добавить ликвидность
        </option>
        <option value="first">В первый токен</option>
        <option value="second">Во второй токен</option>
      </select>
      <input
        className="form-control"
        ref={valueToLiqRef}
        type="number"
        placeholder="Количество токенов"
      />
      <button onClick={handleAddLiq}>Добавить ликвидность</button>

      <h3>Создать новый пул</h3>
      <h3>Адрес GerdaCoin: {gerdaAddress}</h3>
      <h3>Адрес KrendelCoin: {krendelAddress}</h3>
      <h3>Адрес RTKCoin: {rtkAddress}</h3>
      <h3>Адрес ProfiCoin: {profiAddress}</h3>
      <br></br>
      <h3>Адреса пуллов: {poolAddress && poolAddress.join(", ")}</h3>
      <br></br>
      <input
        placeholder="Имя пула"
        value={poolName}
        onChange={(e) => setPoolName(e.target.value)}
      />
      <input
        placeholder="Адрес первого токена"
        value={firstTokenAddress}
        onChange={(e) => setFirstTokenAddress(e.target.value)}
      />
      <input
        placeholder="Адрес следующего токена"
        value={secondTokenAddress}
        onChange={(e) => setSecondTokenAddress(e.target.value)}
      />
      <input
        placeholder="Цена первого токена"
        value={firstTokenPrice}
        onChange={(e) => setFirstTokenPrice(e.target.value)}
      />
      <input
        placeholder="Цена второго токена"
        value={secondTokenPrice}
        onChange={(e) => setSecondTokenPrice(e.target.value)}
      />
      <input
        placeholder="Адрес Lp"
        value={lpAddress}
        onChange={(e) => setLpAddress(e.target.value)}
      />
      <input
        placeholder="Начальное состояние Eth"
        value={startingEthRatio}
        onChange={(e) => setStartingEthRatio(e.target.value)}
      />

      <button onClick={handleCreatePool}>Создать</button>
    </div>
  );
};

export default PoolsList;
