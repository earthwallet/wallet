import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { web3Accounts, web3Enable } from '@earthwallet/sdk';
import { InjectedAccountWithMeta } from '@earthwallet/sdk/build/main/inject/types';

import styles from './styles.module.scss';

function App() {
  const [accounts, setaccounts] = useState<InjectedAccountWithMeta[]>([
    { meta: { name: '', source: '' }, address: '' },
  ]);

  useEffect(() => {
    loadWeb3Accounts();
  }, []);

  const loadWeb3Accounts = async () => {
    await web3Enable('social.network');
    const allAccounts = await web3Accounts();
    console.log(allAccounts, 'InjectedAccountWithMeta', web3Enable);
    setaccounts(allAccounts);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className={styles.heading}>List of Accounts from earthwallet</p>

        {accounts.map((account, index) => (
          <div key={index} className={styles.checkboxcont}>
            <div className={styles.identicont}></div>

            <div className={styles.setting}>
              <div className={styles.selectlabel}>{account?.meta?.name}</div>
              <div className={styles.selectaddresslabel}>
                {account?.meta?.genesisHash === '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3'
                  ? 'Polkadot'
                  : 'ICP'}
              </div>
              <div className={styles.selectaddresslabel}>{account?.address}</div>
            </div>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
