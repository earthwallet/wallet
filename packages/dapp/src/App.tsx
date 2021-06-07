import React, { useEffect, useState } from 'react';
import './App.css';
import { web3Accounts, web3Enable } from '@earthwallet/sdk';
import { InjectedAccountWithMeta } from '@earthwallet/sdk/build/main/inject/types';
import logo from './icon.png';

import styles from './styles.module.scss';

function App() {
  const [accounts, setAccounts] = useState<null | InjectedAccountWithMeta[]>(null);
  const [selectedAccount, setSelectedAccount] = useState<null | InjectedAccountWithMeta>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    loadWeb3Accounts();
  }, []);

  const loadWeb3Accounts = async () => {
    if (accounts != null) return;
    await web3Enable('social.network').catch(err => console.log('web3Enable', err));
    const allAccounts = await web3Accounts().catch(err => console.log('web3Accounts', err));
    console.log(allAccounts, 'InjectedAccountWithMeta', web3Enable);
    if (allAccounts && allAccounts.length) setAccounts(allAccounts);
  };

  useEffect(() => {
    console.log('accounts', accounts);
    console.log('selectedAccount', selectedAccount);
    if (selectedAccount == null && accounts && accounts.length) setSelectedAccount(accounts[0]);
  }, [accounts, selectedAccount]);

  const _onChangePrefix = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
    setShowDropDown(false);
  };

  const getShortAddress = (address: string) => address.substring(0, 6) + '...' + address.substring(address.length - 5);

  return (
    <div className="App">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <img src={logo} className={'App-logo' + (accounts?.length ? ' App-logo-connected' : '')} alt="logo" />

      <div className="App-Body">
        <div className="App-header">
          <div className="App-header-title">EARTH WALLET DApp</div>
          <div
            className="selectedAccount"
            onClick={() => (accounts && accounts?.length > 1 ? setShowDropDown(status => !status) : {})}
          >
            {selectedAccount && getShortAddress(selectedAccount?.address)}
          </div>
          {showDropDown && (
            <div className="addressSelector">
              {accounts?.map(account => {
                return (
                  <div className="addressItem" key={account.address} onClick={() => _onChangePrefix(account)}>
                    {getShortAddress(account.address)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
