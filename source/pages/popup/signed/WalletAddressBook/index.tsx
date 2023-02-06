import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.scss';

import { RouteComponentProps, withRouter } from 'react-router';
import { selectAccountById, selectOtherAccountsOf, selectRecentsOf } from '~state/wallet';
import { useSelector } from 'react-redux';

import { selectActiveTokensAndAssetsByAccountId } from '~state/wallet';
import useQuery from '~hooks/useQuery';
import AddressInput from '~components/AddressInput';
import Header from '~components/Header';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import { getTokenInfo } from '~global/tokens';
import { getInfoBySymbol } from '~global/constant';
import { shortenAddress } from '~global/helpers';
import moment from 'moment-mini';
import { i18nT } from '~i18n/index';

interface keyable {
  [key: string]: any
}

interface Props extends RouteComponentProps<{ accountId: string }> {
}

const WalletAddressBook = ({
  match: {
    params: { accountId },
  },
}: Props) => {
  const queryParams = useQuery();

  const tokenId = queryParams.get('tokenId');
  const assetId = queryParams.get('assetId');


  const [step1, setStep1] = useState(true);
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount || {};
  const assets: keyable = useSelector(selectActiveTokensAndAssetsByAccountId(accountId));

  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<string>('');

  const myAccounts: keyable = useSelector(selectOtherAccountsOf(address));
  const recents: keyable = useSelector(selectRecentsOf(address, tokenId));
  const [ensAddressObj, setEnsAddressObj] = useState<keyable | null>(null);




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

  const onBackClick = useCallback(() => { setStep1(true); }, []);
  const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.id === assetId)[0]
  const [tab, setTab] = useState(0);
  const history = useHistory();

  const filterAccount = () => {
    if (selectedRecp == "") {
      return myAccounts;
    } else {
      return myAccounts.filter(
        (item: keyable) =>
          item?.meta?.name.includes(selectedRecp) ||
          item?.address.includes(selectedRecp)
      );
    }
  };

  useEffect(() => {
    filterAccount();
  }, [selectedRecp]);

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
          <div className={styles.earthInputLabel}>{i18nT('walletAddressBook.addRecp')}</div>
          <AddressInput
            initialValue={selectedRecp}
            recpCallback={setSelectedRecp}
            inputType={selectedAccount?.symbol}
            autoFocus={true}
            tokenId={getSelectedAsset(selectedAsset)?.tokenId}
            search={true}
            ensObjCallback={setEnsAddressObj}
          />
        </div>
        : <div />}
      {ensAddressObj?.address != null ? <div className={styles.listscrollcont}>
        <div className={styles.listitemscont}>
          <div
            onClick={() => replaceQuery('recipient', ensAddressObj?.address)}
            className={styles.listitem}>
            <img className={styles.listicon}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = ICON_PLACEHOLDER;
              }}
              src={getSelectedAsset(selectedAsset)?.icon || getTokenInfo(selectedAsset)?.icon || getInfoBySymbol(selectedAccount.symbol).icon} />
            <div className={styles.listinfo}>
              <div className={styles.listtitle}>{ensAddressObj?.ens}</div>
              <div className={styles.listsubtitle}>{ensAddressObj?.address}</div>
            </div>

            <img
              className={styles.listforward}
              src={ICON_FORWARD}
            />
          </div>
        </div>
      </div> : <div>
        <div className={styles.tabs}>
          <div
            onClick={() => setTab(0)}
            className={clsx(styles.tab, tab === 0 && styles.tab_active)}>
            {i18nT('walletAddressBook.myAccounts')}
          </div>
          <div
            onClick={() => setTab(1)}
            className={clsx(styles.tab, tab === 1 && styles.tab_active)}>
            {i18nT('walletAddressBook.recents')}
          </div>
        </div>
        {tab == 0 &&
          <div className={styles.listscrollcont}>
            {myAccounts?.length == 0 ?
              <div className={styles.centerDiv}>{i18nT('walletAddressBook.noPers')}</div>
              : <div className={styles.listitemscont}>
                {filterAccount().map((account: keyable, index: number) => <div
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
        }
        {tab == 1 &&
          <div className={styles.listscrollcont}>
            {recents?.length == 0 ?
              <div className={styles.centerDiv}>{i18nT('walletAddressBook.noRecent')}</div>
              : <div className={styles.listitemscont}>
                {recents?.map((recent: keyable, index: number) => <div
                  key={index}
                  onClick={() => replaceQuery('recipient', recent?.address)}
                  className={styles.listitem}>
                  <img className={styles.listicon}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = ICON_PLACEHOLDER;
                    }}
                    src={getSelectedAsset(selectedAsset)?.icon || getTokenInfo(selectedAsset)?.icon || getInfoBySymbol(selectedAccount.symbol).icon} />
                  <div className={styles.listinfo}>
                    <div className={styles.listtitle}>{shortenAddress(recent?.address)}</div>
                    <div className={styles.listsubtitle}>{i18nT('walletAddressBook.lastSent')}{' '}{recent.lastSentAt && moment(recent?.lastSentAt).format('Do MMMM YYYY')}</div>
                  </div>
                  <img
                    className={styles.listforward}
                    src={ICON_FORWARD}
                  />
                </div>)}
              </div>}
          </div>
        }
      </div>}
    </div>
  </></div>;
};


export default withRouter(WalletAddressBook);