import { React, useState, useEffect } from 'react';
import './App.css';

function App() {
  const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
  const [myDetails, setMyDetails] = useState({
    name: 'none',
    address: 'none',
    balance: 0,
    frozenBalance: 0,
    network: 'none',
    link: 'false',
  });

  const getBalance = async () => {
    //if wallet installed and logged , getting TRX token balance
    if (window.tronWeb && window.tronWeb.ready) {
      let walletBalances = await window.tronWeb.trx.getAccount(
        window.tronWeb.defaultAddress.base58
      );
      return walletBalances;
    } else {
      return 0;
    }
  };

  const getWalletDetails = async () => {
    if (window.tronWeb) {
      //checking if wallet injected
      if (window.tronWeb.ready) {
        let tempBalance = await getBalance();
        let tempFrozenBalance = 0;

        if (
          !tempBalance.frozen &&
          !tempBalance.account_resource.frozen_balance_for_energy
        ) {
        } else {
          if (tempBalance.account_resource.frozen_balance_for_energy) {
            tempFrozenBalance =
              tempBalance.account_resource.frozen_balance_for_energy;
          } else if (tempBalance.frozen) {
            tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
          } else {
            tempFrozenBalance =
              tempBalance.account_resource.frozen_balance_for_energy +
              tempBalance.frozen[0].frozen_balance;
          }
        }

        //we have wallet and we are logged in
        setMyMessage(<h3>WALLET CONNECTED</h3>);
        setMyDetails({
          name: window.tronWeb.defaultAddress.name,
          address: window.tronWeb.defaultAddress.base58,
          balance: tempBalance.balance / 1000000,
          frozenBalance: tempFrozenBalance / 1000000,
          network: window.tronWeb.fullNode.host,
          link: 'true',
        });
      } else {
        //we have wallet but not logged in
        setMyMessage(<h3>WALLET DETECTED PLEASE LOGIN</h3>);
        setMyDetails({
          name: 'none',
          address: 'none',
          balance: 0,
          frozenBalance: 0,
          network: 'none',
          link: 'false',
        });
      }
    } else {
      //wallet is not detected at all
      setMyMessage(<h3>WALLET NOT DETECTED</h3>);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      //
      getWalletDetails();

      //wallet checking interval 2sec
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="App">
      <div className="Card">
        <h1> TRON WALLET & REACT INTEGRATION </h1>
        <div className="Stats">
          {myMessage}
          <h4>Account Name: {myDetails.name} </h4>
          <h4>My address: {myDetails.address}</h4>
          <h4>
            TRX Balance: {myDetails.balance} TRX (Frozen:{' '}
            {myDetails.frozenBalance} TRX)
          </h4>
          <h4>Tron Network: {myDetails.network}</h4>
          <h4>Link established: {myDetails.link}</h4>
        </div>
        <footer>
          <p>V 0.02 / 2021 &copy; IBNZ DEVELOPERS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
