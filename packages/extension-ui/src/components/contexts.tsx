// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountsContext, AuthorizeRequest, MetadataRequest, NetworksContext, SelectedAccountStruct, SelectedNetworkStruct, SigningRequest } from '@earthwallet/extension-base/background/types';
import type { SettingsStruct } from '@polkadot/ui-settings/types';
import type { AvailableThemes } from './themes';

import React from 'react';

import settings from '@polkadot/ui-settings';

import { defaultNetworkContext } from '../Popup/Utils/Consts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (): void => undefined;

const AccountContext = React.createContext<AccountsContext>({ accounts: [], hierarchy: [], master: undefined, selected: undefined });
const ActionContext = React.createContext<(to?: string) => void>(noop);
const AuthorizeReqContext = React.createContext<AuthorizeRequest[]>([]);
const MediaContext = React.createContext<boolean>(false);
const MetadataReqContext = React.createContext<MetadataRequest[]>([]);
const SettingsContext = React.createContext<SettingsStruct>(settings.get());
const SigningReqContext = React.createContext<SigningRequest[]>([]);
const ThemeSwitchContext = React.createContext<(theme: AvailableThemes) => void>(noop);
const ToastContext = React.createContext<({show: (message: string) => void})>({ show: noop });
const NetworkContext = React.createContext<NetworksContext>(defaultNetworkContext);
const SelectedNetworkContext = React.createContext<SelectedNetworkStruct>(defaultNetworkContext);
const SelectedAccountContext = React.createContext<SelectedAccountStruct>({ selectedAccount: undefined, setSelectedAccount: () => {} });

export {
  AccountContext,
  ActionContext,
  AuthorizeReqContext,
  MediaContext,
  MetadataReqContext,
  SettingsContext,
  SigningReqContext,
  ThemeSwitchContext,
  ToastContext,
  NetworkContext,
  SelectedNetworkContext,
  SelectedAccountContext
};
