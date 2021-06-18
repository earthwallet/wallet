// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import React, { useContext } from 'react';
import styled from 'styled-components';

import BG_WALLET_LIST from '../../assets/bg_wallet_list.png';
import ICON_ADD from '../../assets/icon_add_account.svg';
import { AccountContext, Link, SelectedNetworkContext } from '../../components';
import AccountsTree from './AccountsTree';

interface Props extends ThemeProps {
  className?: string;
}

function Accounts ({ className }: Props): React.ReactElement {
  const { hierarchy } = useContext(AccountContext);

  const { selectedNetwork } = useContext(SelectedNetworkContext);

  return (
    <div className={className}>
      {(hierarchy.length === 0)
        ? <div >
          <div className={'subtitle'}>bringing crypto back to earth</div>
          <div className={'noAccountsActions'}>
            <div className={'earthButtonCont'}>
              <Link to={'/account/create'}>
                <div className={'createButton earthButton'}>Create an Account</div>
              </Link>
            </div>
            <div className={'footerCont'}><div className={'orSep'}>or</div>
              <Link to={'/account/import-seed'}><div className={'earthLink'}>import seed phrase
              </div>
              </Link>
            </div>
          </div>
        </div>
        : (
          <>
            <>
              <div className={'accountTitle'}>Select Account</div>
              <div className={'accountsCont'}>
                {hierarchy
                  .filter(({ genesisHash }) => selectedNetwork.genesisHash.length ? genesisHash === selectedNetwork.genesisHash : true)
                  .map((json, index): React.ReactNode => {
                    //   console.log('hierarchy', json);
                    return (
                      <AccountsTree
                        {...json}
                        key={`${index}:${json.address}`}
                      />
                    );
                  })}

                <Link to={'/account/create'}>
                  <div className={'earthButton createAccountTableButton earthButtonTable'}>
                    <div>Create an Account </div>
                    <img className='iconCopy'
                      src={ICON_ADD} />
                  </div>
                </Link>
              </div>
            </>
            <div className={'footerCont'}><div className={'orSep'}>or</div>
              <Link to={'/account/import-seed'}><div className={'earthLink'}>import seed phrase
              </div>
              </Link>
            </div>
          </>
        )
      }
    </div>
  );
}

export default styled(Accounts)`
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  background: url(${BG_WALLET_LIST});
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .createAccountTableButton {
    width: 291px;
    height: 54px;
    left: 2px;
    top: 56px;
    
    background: linear-gradient(101.54deg, #2496FF 10.81%, #1B63A6 139.52%);
  }

  .accountTitle {
    margin-top: 320px;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    text-align: left;
    line-height: 150%;
    color: #fff;
    width: 100%;
    padding-left: 40px;

    
  }

  .accountsCont {
    height: 190px;
    overflow: scroll;
    margin-top: 10px;
    width: calc(100vw - 40px);
    border: 2px solid rgba(36, 150, 255, 0.5);
    box-sizing: border-box;
    border-radius: 8px;
  }



  .footerCont {
    display: flex;
    margin-top: 18px;
  }

  .orSep{
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 160%;
    /* or 22px */


    /* 🌍 Earth Wallet/Kashmir Blue */

    color: #56708F;

    opacity: 0.8;

    /* Inside Auto Layout */

    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 6px;
  }
  
  .earthButton {
    width: 295px;
    height: 74px;
    background: linear-gradient(101.54deg, #2496FF 10.81%, #1B63A6 139.52%);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .earthLink{
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 160%;
    color: #2496FF;
  }

  .noAccountsActions {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
 
  }

  .earthButtonCont {
    width: 295px;
    height: 56px;
    background: linear-gradient(0deg, #1f75c4 10.81%, #64a3de 139.52%);
    border-radius: 8px;
    padding: 3px;
    cursor: pointer;
    margin-top: 280px;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    text-align: center;
    color: #FAFBFB;
    &:active{
      opacity: 0.7;
      user-select: none;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }
 
  .subtitle {
    margin-top: 180px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    text-transform: capitalize;
    color: #FFFFFF;
    opacity: 0.46;
  }

  .earthButtonTable {
    width: 100%;
    border-radius: 0;
    padding: 0 17px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    }

    &:active {
      opacity: 0.7;
    }
`;
