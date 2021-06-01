// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import { Header } from '@earthwallet/extension-ui/partials';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { AccountContext, SelectedTokenContext } from '../../components';
import AccountsTree from './AccountsTree';
import AddAccount from './AddAccount';

interface Props extends ThemeProps {
  className?: string;
}

function Accounts ({ className }: Props): React.ReactElement {
  const { hierarchy } = useContext(AccountContext);
  const { selectedToken } = useContext(SelectedTokenContext);

  return (
    <>
      {(hierarchy.length === 0)
        ? <AddAccount />
        : (
          <>
            <Header
              showAdd
              showAddressDropdown
            />
            <div className={className}>
              {hierarchy
                .filter(({ genesisHash }) => selectedToken.genesisHash.length ? genesisHash === selectedToken.genesisHash : true)
                .map((json, index): React.ReactNode => {
                  console.log('hierarchy', json);

                  return (
                    <AccountsTree
                      {...json}
                      key={`${index}:${json.address}`}
                    />
                  );
                })}
            </div>
          </>
        )
      }
    </>
  );
}

export default styled(Accounts)`
  height: 100%;
  overflow-y: scroll;
  margin-top: -25px;
  padding-top: 25px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
