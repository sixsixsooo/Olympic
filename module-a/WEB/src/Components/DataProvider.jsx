import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [ownerAddress, setOwnerAddress] = useState(
    "0x1A97A9D06d661fc45E523B391aAc747108C919DB"
  );

  return (
    <DataContext.Provider
      value={{
        web3,
        setWeb3,
        selectedAccount,
        contract,
        setSelectedAccount,
        setContract,
        ownerAddress,
        setOwnerAddress,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
