import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [contractId, setContractId] = useState(() => {
        const savedContractId = sessionStorage.getItem('contractId');
        return savedContractId ? savedContractId : "";
    });
    const [userData, setUserData] = useState(() => {
        const savedUserData = sessionStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : {};
    });
    const [otherInfo, setOtherInfo] = useState(() => {
        const savedOtherInfo = sessionStorage.getItem('otherInfo');
        return savedOtherInfo ? savedOtherInfo : "";
    });
    const [account, setAccount] = useState("");

    useEffect(() => {
        sessionStorage.setItem('contractId', contractId);
    }, [contractId]);

    useEffect(() => {
        sessionStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

    useEffect(() => {
        sessionStorage.setItem('otherInfo', otherInfo);
    }, [otherInfo]);

    return (
        <AppContext.Provider value={{
            contractId,
            setContractId,
            userData,
            setUserData,
            otherInfo,
            setOtherInfo,
            account,
            setAccount
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};