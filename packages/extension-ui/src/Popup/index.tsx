// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountJson, AccountsContext, AuthorizeRequest, MetadataRequest, NetworkJson, SigningRequest } from '@earthwallet/extension-base/background/types';
import type { SettingsStruct } from '@earthwallet/ui-settings/types';

import { PHISHING_PAGE_REDIRECT } from '@earthwallet/extension-base/defaults';
import { canDerive } from '@earthwallet/extension-base/utils';
import uiSettings from '@earthwallet/ui-settings';
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';

import { ErrorBoundary, Loading } from '../components';
import { AccountContext, ActionContext, AuthorizeReqContext, MediaContext, MetadataReqContext, NetworkContext, SelectedAccountContext, SelectedNetworkContext, SettingsContext, SigningReqContext } from '../components/contexts';
import ToastProvider from '../components/Toast/ToastProvider';
import { subscribeAccounts, subscribeAuthorizeRequests, subscribeMetadataRequests, subscribeSigningRequests } from '../messaging';
import { buildHierarchy } from '../util/buildHierarchy';
import Details from './Transactions/Details';
import { defaultNetworkContext } from './Utils/Consts';
import Wallet from './Wallet/Wallet';
import WalletReceiveTokens from './Wallet/WalletReceiveTokens';
import WalletSendTokens from './Wallet/WalletSendTokens';
import Accounts from './Accounts';
import AuthList from './AuthManagement';
import Authorize from './Authorize';
import CreateAccount from './CreateAccount';
import Derive from './Derive';
import Export from './Export';
import ExportAll from './ExportAll';
import Forget from './Forget';
import ImportLedger from './ImportLedger';
import ImportQr from './ImportQr';
import ImportSeed from './ImportSeed';
import Metadata from './Metadata';
import PhishingDetected from './PhishingDetected';
import RestoreJson from './RestoreJson';
import Signing from './Signing';
import Transactions from './Transactions';

// import Welcome from './Welcome';

const startSettings = uiSettings.get();

// Request permission for video, based on access we can hide/show import
async function requestMediaAccess (cameraOn: boolean): Promise<boolean> {
  if (!cameraOn) {
    return false;
  }

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    return true;
  } catch (error) {
    console.error('Permission for video declined', (error as Error).message);
  }

  return false;
}

function initAccountContext (accounts: AccountJson[]): AccountsContext {
  const hierarchy = buildHierarchy(accounts);
  const master = hierarchy.find(({ isExternal, type }) => !isExternal && canDerive(type));

  return {
    accounts,
    hierarchy,
    master
  };
}

export default function Popup (): React.ReactElement {
  const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
  const [accountCtx, setAccountCtx] = useState<AccountsContext>({ accounts: [], hierarchy: [] });
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(null);
  const [cameraOn, setCameraOn] = useState(startSettings.camera === 'on');
  const [mediaAllowed, setMediaAllowed] = useState(false);
  const [metaRequests, setMetaRequests] = useState<null | MetadataRequest[]>(null);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [isWelcomeDone, setWelcomeDone] = useState(false);
  const [settingsCtx, setSettingsCtx] = useState<SettingsStruct>(startSettings);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkJson>(defaultNetworkContext.selectedNetwork);
  const [selectedAccount, setSelectedAccount] = useState<undefined | AccountJson>(undefined);
  const selectedNetworkValue = { selectedNetwork, setSelectedNetwork };
  const selectedSelectedAccount = { selectedAccount, setSelectedAccount };

  const _onAction = (to?: string): void => {
    setWelcomeDone(window.localStorage.getItem('welcome_read') === 'ok');

    if (to) {
      window.location.hash = to;
    }
  };

  useEffect((): void => {
    Promise.all([
      subscribeAccounts(setAccounts),
      subscribeAuthorizeRequests(setAuthRequests),
      subscribeMetadataRequests(setMetaRequests),
      subscribeSigningRequests(setSignRequests)
    ]).catch(console.error);

    uiSettings.on('change', (settings): void => {
      setSettingsCtx(settings);
      setCameraOn(settings.camera === 'on');
    });

    _onAction();
  }, []);

  useEffect((): void => {
    setAccountCtx(initAccountContext(accounts || []));
  }, [accounts]);

  useEffect((): void => {
    window.localStorage.setItem('welcome_read', 'ok');
  }, []);

  useEffect((): void => {
    requestMediaAccess(cameraOn)
      .then(setMediaAllowed)
      .catch(console.error);
  }, [cameraOn]);

  function wrapWithErrorBoundary(component: React.ReactElement, trigger?: string): React.ReactElement {
    // console.log('wrapWithErrorBoundary', trigger);
    return <ErrorBoundary trigger={trigger}>{component}</ErrorBoundary>;
  }

  const Root = () => {
    return (isWelcomeDone
      ? authRequests && authRequests.length
        ? wrapWithErrorBoundary(<Authorize />, 'authorize')
        : metaRequests && metaRequests.length
          ? wrapWithErrorBoundary(<Metadata />, 'metadata')
          : signRequests && signRequests.length
            ? wrapWithErrorBoundary(<Signing />, 'signing')
            : wrapWithErrorBoundary(<Accounts />, 'accounts')
      : wrapWithErrorBoundary(<Accounts />, 'accounts'));
  };

  return (
    <Loading>{accounts && authRequests && metaRequests && signRequests && (
      <ActionContext.Provider value={_onAction}>
        <SettingsContext.Provider value={settingsCtx}>
          <AccountContext.Provider value={accountCtx}>
            <AuthorizeReqContext.Provider value={authRequests}>
              <MediaContext.Provider value={cameraOn && mediaAllowed}>
                <MetadataReqContext.Provider value={metaRequests}>
                  <SigningReqContext.Provider value={signRequests}>
                    <NetworkContext.Provider value={{ networks: defaultNetworkContext.networks }}>
                      <SelectedNetworkContext.Provider value={selectedNetworkValue}>
                        <SelectedAccountContext.Provider value={selectedSelectedAccount}>
                          <ToastProvider>
                            <Switch>
                              <Route path='/auth-list'>{wrapWithErrorBoundary(<AuthList />, 'auth-list')}</Route>
                              <Route path='/accounts'>{wrapWithErrorBoundary(<Accounts />, 'accounts')}</Route>
                              <Route path='/account/create'>{wrapWithErrorBoundary(<CreateAccount />, 'account-creation')}</Route>
                              <Route path='/account/forget/:address'>{wrapWithErrorBoundary(<Forget />, 'forget-address')}</Route>
                              <Route path='/account/export/:address'>{wrapWithErrorBoundary(<Export />, 'export-address')}</Route>
                              <Route path='/account/export-all'>{wrapWithErrorBoundary(<ExportAll />, 'export-all-address')}</Route>
                              <Route path='/account/import-ledger'>{wrapWithErrorBoundary(<ImportLedger />, 'import-ledger')}</Route>
                              <Route path='/account/import-qr'>{wrapWithErrorBoundary(<ImportQr />, 'import-qr')}</Route>
                              <Route path='/account/import-seed'>{wrapWithErrorBoundary(<ImportSeed />, 'import-seed')}</Route>
                              <Route path='/account/restore-json'>{wrapWithErrorBoundary(<RestoreJson />, 'restore-json')}</Route>
                              <Route path='/account/derive/:address/locked'>{wrapWithErrorBoundary(<Derive isLocked />, 'derived-address-locked')}</Route>
                              <Route path='/account/derive/:address'>{wrapWithErrorBoundary(<Derive />, 'derive-address')}</Route>
                              <Route path='/wallet/home'>{wrapWithErrorBoundary(<Wallet />, 'wallet')}</Route>
                              <Route path='/wallet/transactions/:address'>{wrapWithErrorBoundary(<Transactions />, 'transactions')}</Route>
                              <Route path='/wallet/transaction/:txnId'>{wrapWithErrorBoundary(<Details />, 'transactions')}</Route>
                              <Route path='/wallet/send'>{wrapWithErrorBoundary(<WalletSendTokens />, 'wallet-send-token')}</Route>
                              <Route path='/wallet/receive'>{wrapWithErrorBoundary(<WalletReceiveTokens />, 'wallet-receive-token')}</Route>
                              <Route path={`${PHISHING_PAGE_REDIRECT}/:website`}>{wrapWithErrorBoundary(<PhishingDetected />, 'phishing-page-redirect')}</Route>
                              <Route
                                exact
                                path='/'
                              >
                                {Root()}
                              </Route>
                            </Switch>
                          </ToastProvider>
                        </SelectedAccountContext.Provider>
                      </SelectedNetworkContext.Provider>
                    </NetworkContext.Provider>
                  </SigningReqContext.Provider>
                </MetadataReqContext.Provider>
              </MediaContext.Provider>
            </AuthorizeReqContext.Provider>
          </AccountContext.Provider>
        </SettingsContext.Provider>
      </ActionContext.Provider>
    )}</Loading>
  );
}
