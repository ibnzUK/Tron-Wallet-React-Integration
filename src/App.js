import { React, useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tronLinkState, setTronLinkState] = useState('null');
  const [connectedWallet, setconnectedWallet] = useState([
    {
      address: 'null',
      name: 'null',
    },
  ]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('null');
  const [networkState, setNetworkState] = useState('null');
  const [myMessage, setMyMessage] = useState(<h3> CHECKING </h3>);
  let tradeobj = 'nne';

  const connectTronlink = async () => {
    await new Promise((resolve) => {
      const tronWebState = {
        installed: !!window.tronWeb,
        loggedIn: window.tronWeb && window.tronWeb.ready,
      };

      if (tronWebState.installed) {
        setTronLinkState(tronWebState.LoggedIn);
        return resolve();
      }
   
    });

  };
  const loadData = async () => {
    setconnectedWallet([
      {
        address: window.tronWeb.defaultAddress.base58,
        name: window.tronWeb.defaultAddress.name,
      },
    ]);
    setWalletAddress(window.tronWeb.defaultAddress.base58);
    tradeobj = await window.tronWeb.trx.getAccount(
      window.tronWeb.defaultAddress.base58
    );

    setNetworkState(window.tronWeb.fullNode.host);
    setTronLinkState('True');
    setMyMessage(<h3> WALLET DETECTED</h3>);

    setAccountBalance((await tradeobj.balance) / 1000000);
  };

  useEffect(() => {
    connectTronlink();
  }, []);

  useEffect(() => {
    connectTronlink();
    //starting temp monitoring every 1 sec
    const interval = setInterval(() => {
      loadData();
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
          <h4>Account Name: {connectedWallet[0].name} </h4>
          <h4>My address: {walletAddress}</h4>
          <h4>TRX Balance: {accountBalance} TRX</h4>
          <h4>Tron Network: {networkState}</h4>
          <h4>Link established: {tronLinkState}</h4>
        </div>
        {/* <button
          onClick={() => {
            loadData();
          }}
        >
          Do Something
        </button> */}
        <footer>
          <p>V 0.01 / 2021 &copy; IBNZ DEVELOPERS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
