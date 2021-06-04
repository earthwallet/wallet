import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { web3Accounts, web3Enable } from '@earthwallet/extension-dapp';
import styles from './styles.module.scss';

function App() {
  const [accounts, setaccounts] = useState([{ meta: { name: '' }, address: '' }]);

  useEffect(() => {
    loadWeb3Accounts();
  }, []);

  const loadWeb3Accounts = async () => {
    await web3Enable('social.network');
    const allAccounts = await web3Accounts();
    setaccounts(allAccounts);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        {accounts.map((account, index) => (
          <div key={index} className={styles.checkboxcont}>
            <div className={styles.identicont}></div>

            <div className={styles.setting}>
              <div className={styles.selectlabel}>{account?.meta?.name}</div>
              <div className={styles.selectaddresslabel}>{account?.address}</div>
            </div>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
