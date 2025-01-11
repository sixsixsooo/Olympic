import React, { useState } from "react";
import getWeb3 from "../Components/web3";
import FactoryABI from "../Factory.abi";
import FactoryAddress from "../Factory.address";

const CreatePool = () => {
    const [poolName, setPoolName] = useState("");
    const [firstToken, setFirstToken] = useState("");
    const [secondToken, setSecondToken] = useState("");
    const [firstPrice, setFirstPrice] = useState("");
    const [secondPrice, setSecondPrice] = useState("");
    const [lpAddress, setLpAddress] = useState("");
    const [ethRatio, setEthRatio] = useState("");

    const handleCreatePool = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(FactoryABI, FactoryAddress);
            await contract.methods.createPool(
                poolName,
                firstToken,
                secondToken,
                firstPrice,
                secondPrice,
                lpAddress,
                ethRatio
            ).send({ from: accounts[0] });
            alert("Pool created successfully!");
        } catch (error) {
            console.error("Error creating pool:", error);
        }
    };

    return (
        <div>
            <h2>Create Pool</h2>
            <input type="text" placeholder="Pool Name" onChange={(e) => setPoolName(e.target.value)} />
            <input type="text" placeholder="First Token Address" onChange={(e) => setFirstToken(e.target.value)} />
            <input type="text" placeholder="Second Token Address" onChange={(e) => setSecondToken(e.target.value)} />
            <input type="number" placeholder="First Token Price" onChange={(e) => setFirstPrice(e.target.value)} />
            <input type="number" placeholder="Second Token Price" onChange={(e) => setSecondPrice(e.target.value)} />
            <input type="text" placeholder="LP Address" onChange={(e) => setLpAddress(e.target.value)} />
            <input type="number" placeholder="ETH Ratio" onChange={(e) => setEthRatio(e.target.value)} />
            <button onClick={handleCreatePool}>Create Pool</button>
        </div>
    );
};

export default CreatePool;
