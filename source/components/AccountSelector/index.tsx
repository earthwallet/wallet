import React, { useEffect, useRef, useState } from 'react';
import { keyable } from '~scripts/Background/types/IAssetsController';
import styles from './index.scss';
import { getShortAddress } from '~utils/common';
import SMALL_DOWN from '~assets/images/small_down.svg';
import SMALL_UP from '~assets/images/small_up.svg';
interface Props {
  selectedAccount?: keyable;
  accounts: keyable;
}

const AccountSelector = ({ selectedAccount, accounts }: Props): React.ReactElement<Props> => {
  const [showDropDown, setShowDropDown] = useState(false);
  const dropDownRef = useRef(null);

  const [selectedAccountText, setSelectedAccountText] = useState<string>();
  const _onChangePrefix = (account: keyable) => {
    setSelectedAccountText(account.address);
    //setSelectedAccount(account);
    setShowDropDown(false);
  };

  useEffect(() => {
    setSelectedAccountText(selectedAccount?.address);
  }, [selectedAccount]);

  return <div className={styles.page}
    ref={dropDownRef}
  >
    {selectedAccountText && <div className='selectedAccountDiv'>
      <div className='selectedAccount'
        onClick={() => accounts.length > 1 ? setShowDropDown((status) => !status) : {}}>
        {selectedAccount?.genesisHash && <div className='networkColor'
          style={{ backgroundColor: '#eee' }} />}
        {getShortAddress(selectedAccountText)}
        {accounts.length > 1 && (<img
          className='dropDownIcon'
          color='#F4F5F8'
          src={showDropDown ? SMALL_DOWN : SMALL_UP}
        />)}
      </div>
    </div>}
    {showDropDown && <div className='addressSelector'>
      {
        accounts.map((account: keyable) => {
          return (<div className='addressItem'
            key={account.address}
            onClick={() => _onChangePrefix(account)}>
            {account?.genesisHash && <div className='networkColor'
              style={{ backgroundColor: "#eee" }} />}
            {getShortAddress(account.address)}
          </div>);
        })
      }
    </div>}

  </div>;
};

export default AccountSelector;
