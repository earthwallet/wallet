import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.scss';
import NextStepButton from '~components/NextStepButton';

import { RouteComponentProps, withRouter } from 'react-router';
import { selectAccountById, selectOtherAccountsOf } from '~state/wallet';
import { useSelector } from 'react-redux';

import { selectActiveTokensAndAssetsICPByAddress } from '~state/wallet';
import useQuery from '~hooks/useQuery';
import AddressInput from '~components/AddressInput';
import Header from '~components/Header';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import { getTokenInfo } from '~global/tokens';
import { getInfoBySymbol } from '~global/constant';

interface keyable {
  [key: string]: any
}

interface Props extends RouteComponentProps<{ address: string }> {
}

const WalletAddressBook = ({
  match: {
    params: { address },
  },
}: Props) => {
  const queryParams = useQuery();

  const tokenId = queryParams.get('tokenId');
  const assetId = queryParams.get('assetId');


  const [step1, setStep1] = useState(true);
  const selectedAccount = useSelector(selectAccountById(address));

  const assets: keyable = useSelector(selectActiveTokensAndAssetsICPByAddress(address));

  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [recpError, setRecpError] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('');

  const myAccounts: keyable = useSelector(selectOtherAccountsOf(address));




  useEffect(() => {
    if (assetId === null && tokenId === null) {
      setSelectedAsset(selectedAccount?.symbol)
    }
    else if (assetId !== null) {
      setSelectedAsset(assetId || '');
    }
    else if (tokenId !== null) {
      setSelectedAsset(tokenId || '');
    }
  }, [assetId !== null, tokenId !== null]);

  const onConfirm = useCallback(() => {
    if (selectedAsset !== selectedAccount?.symbol) {
      setStep1(false);
    }
    else {
      setStep1(false);
    }

  }, [selectedAccount, selectedAsset]);

  const onBackClick = useCallback(() => { setStep1(true); }, []);
  const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.id === assetId)[0]
  const [tab, setTab] = useState(0);
  const history = useHistory();

  const replaceQuery = (
    key: string,
    value: string,
  ) => {
    let searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    history.push({
      pathname: location.pathname.replace('send', 'confirmsend'),
      search: searchParams.toString(),
    });
  };
  return <div className={styles.page}><>
    <Header
      backOverride={step1 ? undefined : onBackClick}
      centerText
      showMenu
      text={'Send'}
      type={'wallet'} />
    <div className={styles.pagecont}
      ref={dropDownRef}
    >

      {step1
        ? <div style={{ width: '100vw' }}>
          <div className={styles.earthInputLabel}>Add recipient</div>
          <AddressInput
            initialValue={selectedRecp}
            recpErrorCallback={setRecpError}
            recpCallback={setSelectedRecp}
            inputType={selectedAccount?.symbol}
            autoFocus={true}
            tokenId={getSelectedAsset(selectedAsset)?.tokenId}
            search={true}
          />
        </div>
        : <div />}
      <div className={styles.tabs}>
        <div
          onClick={() => setTab(0)}
          className={clsx(styles.tab, tab === 0 && styles.tab_active)}>
          My Accounts
        </div>
        <div
          onClick={() => setTab(1)}
          className={clsx(styles.tab, tab === 1 && styles.tab_active)}>
          Recents
        </div>
      </div>
      {tab == 0 && <div className={styles.listitemscont}>
        {myAccounts.map((account: keyable, index: number) => <div
          key={index}
          onClick={() => replaceQuery('recipient', getTokenInfo(selectedAsset).type == 'DIP20' ? account?.meta?.principalId : account?.address)}
          className={styles.listitem}>
          <img className={styles.listicon}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = ICON_PLACEHOLDER;
            }}
            src={getSelectedAsset(selectedAsset)?.icon || getTokenInfo(selectedAsset)?.icon || getInfoBySymbol(selectedAccount.symbol).icon} />
          <div className={styles.listinfo}>
            <div className={styles.listtitle}>{account?.meta?.name}</div>
            <div className={styles.listsubtitle}>{getTokenInfo(selectedAsset).type == 'DIP20' ? account?.meta?.principalId : account?.address}</div>
          </div>

          <img
            className={styles.listforward}
            src={ICON_FORWARD}
          />
        </div>)}
      </div>}
    </div>
    {false && <div style={{
      margin: '0 30px 30px 30px',
      position: 'absolute',
      bottom: 0,
      left: 0
    }}>
      {step1
        ? <NextStepButton
          disabled={!selectedRecp || recpError !== ''}
          loading={false}
          onClick={onConfirm}>
          {'Next'}
        </NextStepButton>

        : <div />}
    </div>}
  </></div>;
};


export default withRouter(WalletAddressBook);
