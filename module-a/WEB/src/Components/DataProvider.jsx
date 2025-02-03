import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState("");


    return (
        <DataContext.Provider value={{
            web3,
            setWeb3,
            selectedAccount,
            contract,
            setSelectedAccount,
            setContract,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);