import React, { useState, useEffect } from 'react'
import * as ethers from "ethers"
import Contract from "../contract/abi.json";


const ConnectWallet = () => {
    const [address, setAddress] = useState("");
    const [mintAmount, setMintAmount] = useState(0);
    const [getBalanceAddress, setGetBalanceAddress] = useState("");
    const [transferToAddress, setTransferToAddress] = useState("");
    const [transferToAmount, setTransferToAmount] = useState(0);
    const [approveAddress, setApproveAddress] = useState("");
    const [approveAmount, setApproveAmount] = useState(0);
    const [transferFromFromAddress, setTransferFromFromAddress] = useState("");
    const [transferFromToAddress, setTransferFromToAddress] = useState("");
    const [transferFromAmount, setTransferFromAmount] = useState(0);
    const [allowanceAddress, setAllowanceAddress] = useState('');
    const [spenderAddress, setSpenderAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState("");


    const connectToWallet = async () => {
        if (window.ethereum) {
            const accountLogin = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log(accountLogin)
            console.log("Address:  ", accountLogin[0])
            setAddress(accountLogin[0])
            alert("Connected");
        } else {
            alert("Install Metamask extension!!");
        }
        
    };

    useEffect(() => {
        const checkAccount = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts',
                    });
                    if (accounts.length > 0) {
                        const connectedAddress = accounts[0];
                        setAddress(connectedAddress);
                        setConnectedAddress(connectedAddress);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
    
        // Gọi hàm kiểm tra khi component được tạo ra
        checkAccount();
    
        // Sử dụng sự kiện "accountsChanged" để xử lý sự thay đổi địa chỉ
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                const connectedAddress = accounts[0];
                setAddress(connectedAddress);
                setConnectedAddress(connectedAddress);
            } else {
                // Người dùng đã ngắt kết nối tài khoản
                setAddress("");
                setConnectedAddress("");
            }
        });
    
        const intervalId = setInterval(checkAccount, 1000);
        
        return () => {
            clearInterval(intervalId);
            window.ethereum.removeAllListeners('accountsChanged');
        };
    }, []);
    const mintToken = async (e) => {
        e.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const InsContract = new ethers.Contract(
            Contract.address,
            Contract.abi,
            signer
        );

        try {
            setLoading(true); // Set loading to true when minting starts
            const mint = await InsContract.mint(address, mintAmount);
            const transactionHash = await mint.wait();
            console.log("Hash: ", transactionHash);
            alert("Minted successfully!");
        } catch (error) {
            console.error(error);
            alert("Error occurred while minting tokens.");
        } finally {
            setLoading(false); // Set loading to false when minting is done (success or error)
            //setMintingAddress("");
        }
    };

    const getBalanceOf = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const InsContract = new ethers.Contract(
            Contract.address,
            Contract.abi,
            provider
        );

        try {
            const balance = await InsContract.balanceOf(getBalanceAddress);
            alert(`Balance of ${getBalanceAddress}: ${balance.toString()}`);
        } catch (error) {
            console.error(error);
            alert("Error occurred while fetching balance.");
        }
    };

    const transferTo = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const InsContract = new ethers.Contract(
            Contract.address,
            Contract.abi,
            signer
        );
        console.log('test');
        try {
            const transfer = await InsContract.transfer(transferToAddress,ethers.utils.parseEther(transferToAmount));
            const transactionHash = await transfer.wait();
            console.log("Hash: ", transactionHash);
            alert(`Transferred ${transferToAmount} tokens to ${transferToAddress} successfully!`);
        } catch (error) {
            console.error(error);
            alert("Error occurred while transferring tokens.");
        }
    };

    const approve = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const InsContract = new ethers.Contract(
            Contract.address,
            Contract.abi,
            signer
        );

        try {
            const approval = await InsContract.approve(approveAddress, approveAmount);
            const transactionHash = await approval.wait();
            console.log("Hash: ", transactionHash);
            alert(`Approved ${approveAmount} tokens to ${approveAddress} successfully!`);
        } catch (error) {
            console.error(error);
            alert("Error occurred while approving tokens.");
        }
    };

    const transferFromTo = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const InsContract = new ethers.Contract(
            Contract.address,
            Contract.abi,
            signer
        );

        try {
            const transfer = await InsContract.transferFrom(transferFromFromAddress, transferFromToAddress, transferFromAmount);
            const transactionHash = await transfer.wait();
            console.log("Hash: ", transactionHash);
            alert(`Transferred ${transferFromAmount} tokens from ${transferFromFromAddress} to ${transferFromToAddress} successfully!`);
        } catch (error) {
            console.error(error);
            alert("Error occurred while transferring tokens.");
        }
    };

    const getAllowance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const InsContract = new ethers.Contract(
          Contract.address,
          Contract.abi,
          provider
        );
    
        try {
          const allowanceValue = await InsContract.allowance(
            allowanceAddress,
            spenderAddress
          );
          alert(
            `Allowance of ${allowanceAddress} for ${spenderAddress}: ${allowanceValue.toString()}`
          );
        } catch (error) {
          console.error(error);
          alert('Error occurred while fetching allowance.');
        }
      };

    return (
        <div>
            <button onClick={connectToWallet}>Connect Wallet</button>
            <div>
            <p>Connected Address: {connectedAddress}</p>
            </div>
            <div>
                <h3>Mint Tokens</h3>
                <form onSubmit={mintToken}>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>Mint</button>
                </form>
                {loading && (
                    <div className="loading-overlay">
                        <div className="loader"></div>
                        <div>Minting for {address}</div>
                    </div>
                )}
            </div>
            <div>
                <h3>Get Balance Of</h3>
                <form onSubmit={getBalanceOf}>
                    <input
                        type="text"
                        placeholder="Address"
                        value={getBalanceAddress}
                        onChange={(e) => setGetBalanceAddress(e.target.value)}
                    />
                    <button type="button" onClick={getBalanceOf}>Get Balance</button>
                </form>
            </div>
            <div>
                <h3>Transfer To</h3>
                <form>
                    <input
                        type="text"
                        placeholder="Recipient Address"
                        value={transferToAddress}
                        onChange={(e) => setTransferToAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={transferToAmount}
                        onChange={(e) => setTransferToAmount(e.target.value)}
                    />
                    <input type='button' value = "Transfer"onClick={transferTo}/>
                </form>
            </div>
            <div>
                <h3>Approve</h3>
                <form onSubmit={approve}>
                    <input
                        type="text"
                        placeholder="Spender Address"
                        value={approveAddress}
                        onChange={(e) => setApproveAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={approveAmount}
                        onChange={(e) => setApproveAmount(e.target.value)}
                    />
                    <input type="button" value="Approve" onClick={approve}/>
                </form>
            </div>
            <div>
      {/* ... (existing JSX) */}
      <div>
        <h3>Allowance</h3>
        <form onSubmit={getAllowance}>
          <input
            type="text"
            placeholder="Owner Address"
            value={allowanceAddress}
            onChange={(e) => setAllowanceAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Spender Address"
            value={spenderAddress}
            onChange={(e) => setSpenderAddress(e.target.value)}
          />
          <button type="submit">Get Allowance</button>
        </form>
      </div>
    </div>
            <div>
                <h3>Transfer From</h3>
                <form onSubmit={transferFromTo}>
                    <input
                        type="text"
                        placeholder="From Address"
                        value={transferFromFromAddress}
                        onChange={(e) => setTransferFromFromAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="To Address"
                        value={transferFromToAddress}
                        onChange={(e) => setTransferFromToAddress(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={transferFromAmount}
                        onChange={(e) => setTransferFromAmount(e.target.value)}
                    />
                    <input type='button' onClick={transferFromTo} value="Transfer From To" />
                </form>
            </div>
        </div>
    )
}

export default ConnectWallet
