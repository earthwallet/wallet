// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import React, { useContext } from 'react';
import styled from 'styled-components';

import BG_WALLET_LIST from '../../assets/bg_wallet_list.png';
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
            <div className={'linkCont'}><div className={'orSep'}>or</div>
              <Link to={'/account/import-seed'}><div className={'earthLink'}>import seed phrase
              </div>
              </Link>
            </div>
          </div>
        </div>
        : (
          <>
            <>
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
            </>
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

  .linkCont {
    display: flex;
    margin-top: 18px;
  }
  .orSep{

    font-family: Poppins;
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
    height: 56px;
    background: linear-gradient(101.54deg, #2496FF 10.81%, #1B63A6 139.52%);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .earthLink{
    font-family: Poppins;
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
    font-family: Poppins;
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
  .earthButton
  {

  }
  .subtitle {
    margin-top: 180px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 150%;
    /* identical to box height, or 24px */

    text-align: center;
    text-transform: capitalize;

    color: #FFFFFF;

    opacity: 0.46;
  }
`;
