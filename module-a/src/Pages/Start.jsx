import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const Auth = () => {
    const [condition, setCondition] = useState(false);
    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState("");

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
            } else {
                alert('Пожалуйста, установите MetaMask!');
            }
        };

        initWeb3();
    }, []);

    const handleButtonClick = async () => {
        if (!web3) {
            alert('Web3 не инициализирован. Пожалуйста, обновите страницу.');
            return;
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0]); // Сохраняем первый аккаунт
                setCondition(true);
                navigate('/main');
            } else {
                alert('Пожалуйста, подключите кошелек!');
            }
        } catch (error) {
            console.error("Ошибка при подключении к MetaMask:", error);
            alert('Не удалось подключиться к кошельку. Пожалуйста, попробуйте еще раз.');
        }
    };

    return (
        <div>
            <h1>Авторизация</h1>
            <button onClick={handleButtonClick}>Войти</button>
        </div>
    );
};

export default Auth;