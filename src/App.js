import { React, useState, useEffect } from 'react';
import './App.css';

function App() {
  const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
  const [myDetails, setMyDetails] = useState({
    name: 'none',
    address: 'none',
    balance: 0,
    network: 'none',
    link: 'false',
  });

  const getBalance = async () => {
    //if tronlink installed and logged , getting TRX token balance
    if (window.tronWeb && window.tronWeb.ready) {
      let walletBalances = await window.tronWeb.trx.getAccount(
        window.tronWeb.defaultAddress.base58
      );
      return walletBalances;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      //
      if (window.tronWeb) {
        //checking if wallet injected
        if (window.tronWeb.ready) {
          let tempBalance = await getBalance();
         if(!tempBalance.balance) {
          tempBalance.balance = 0;
         } 
          //we have wallet and we are logged in
          setMyMessage(<h3>WALLET CONNECTED</h3>);
          setMyDetails({
            name: window.tronWeb.defaultAddress.name,
            address: window.tronWeb.defaultAddress.base58,
            balance: tempBalance.balance /1000000,
            network: window.tronWeb.fullNode.host,
            link: 'true',
            // balance: await window.tronWeb.trx.getAccount(
            //   window.tronWeb.defaultAddress.base58
            // )
          });
        } else {
          //we have wallet but not logged in
          setMyMessage(<h3>WALLET DETECTED PLEASE LOGIN</h3>);
          setMyDetails({
            name: 'none',
            address: 'none',
            balance: 0,
            network: 'none',
            link: 'false',
          });
        }
      } else {
        //wallet is not detected at all
        setMyMessage(<h3>WALLET NOT DETECTED</h3>);
      }

      //wallet checking interval 2sec
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <div className="Card">
        <h1> TRONLINK REACT INTEGRATION</h1>
        <div className="Stats">
          {myMessage}
          <h4>Account Name: {myDetails.name} </h4>
          <h4>My address: {myDetails.address}</h4>
          <h4>TRX Balance: {myDetails.balance} TRX</h4>
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
