import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.scss';
import { getShortAddress } from '~utils/common';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import ICON_COPY from '~assets/images/icon_copy.svg';
import Header from '~components/Header';
import QRCode from 'qrcode.react';
import NextStepButton from '~components/NextStepButton';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import useToast from '~hooks/useToast';
import { getInfoBySymbol } from '~global/constant';
import ToolTipInfo from '~components/ToolTipInfo';
import { selectInfoBySymbolOrToken } from '~state/tokens';
import { i18nT } from '~i18n/index';
import { keyable } from '~scripts/Background/types/IMainController';
import { unsResolveAddress } from '~utils/unstoppable';

interface Props extends RouteComponentProps<{ accountId: string, symbolOrTokenId?: string }> { }
const WalletReceiveTokens = ({
  match: {
    params: { accountId, symbolOrTokenId },
  },
}: Props) => {
  const history = useHistory();
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address, symbol } = selectedAccount;
  const symbolOrTokenInfo = symbolOrTokenId == undefined ? {} : useSelector(selectInfoBySymbolOrToken(symbolOrTokenId, address));

  const { show } = useToast();
  const _onCopy = useCallback((): void => show('Copied'), [show]);
  const [domainAliases, setDomainAliases] = useState<keyable>([]);

  const getDomainsOfAddress = async (address: string, symbol: string) => {
    const resp = await unsResolveAddress(address, symbol);
    setDomainAliases(resp);
  }
  useEffect(() => {
    if (address == undefined) return;
    getDomainsOfAddress(address, symbol)
  }, [address, symbol]);


  return (
    <div className={styles.page}>
      <Header
        text={i18nT('walletReceiveTokens.header')}
        showAccountsDropdown showMenu type="wallet" > <div className={styles.empty} /></Header>
      <div className={styles.container}>
        {symbolOrTokenInfo?.addressType == 'principal'
          ? <IdCard id={selectedAccount?.meta?.principalId}
            symbol={symbolOrTokenInfo?.symbol}
            _onCopy={_onCopy} />
          : <IdCard id={selectedAccount?.address}
            symbol={selectedAccount?.symbol}
            _onCopy={_onCopy} />}
        {symbolOrTokenInfo?.addressType != 'principal' && selectedAccount?.meta?.principalId && <div className={styles.principalCont}>
          <div className={styles.accountShareCont}>
            <div className={styles.accountShare}>{i18nT('walletReceiveTokens.princLabel')}</div>
            <ToolTipInfo
              placement='left'
              title={i18nT('walletReceiveTokens.princTooltip')} />
          </div>
          <div className={styles.accountDetail}>
            <div className={styles.addressDisplay}>
              {getShortAddress(selectedAccount?.meta?.principalId)}
              <CopyToClipboard text={selectedAccount?.meta?.principalId}>
                <img src={ICON_COPY} className={styles.copyIcon} onClick={_onCopy} />
              </CopyToClipboard>
            </div>
          </div>
        </div>}
        {domainAliases?.length > 0 && domainAliases.map((alias: string, index: number) =>
          <div
            key={index}
            className={styles.principalCont}>
            <div className={styles.accountShareCont}>
              <div className={styles.accountShare}>Address Alias</div>
            </div>
            <div className={styles.accountDetail}>
              <div className={styles.addressDisplay}>
                {alias}
                <CopyToClipboard text={alias}>
                  <img src={ICON_COPY} className={styles.copyIcon} onClick={_onCopy} />
                </CopyToClipboard>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          margin: '0 30px 30px 30px',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <NextStepButton
          disabled={false}
          onClick={() =>
            history.push(`/account/export/${selectedAccount?.id || ''}`)
          }
        >
          {i18nT('walletReceiveTokens.cta')}
        </NextStepButton>
      </div>
    </div >
  );
};

const IdCard = ({ id, symbol, _onCopy }: { id: string, symbol: string, _onCopy: () => void }) =>
  <><div className={styles.accountShareCont}>
    <div className={styles.accountShare}>Your {
      getInfoBySymbol(symbol)?.addressTitle != undefined
        ? getInfoBySymbol(symbol)?.addressTitle
        : i18nT('walletReceiveTokens.pubAddr')}</div>
    <ToolTipInfo
      placement='left'
      title={i18nT('walletReceiveTokens.tooltip') + ` ${symbol}`} />
  </div>

    <div className={styles.accountDetail}>
      {id && (
        <div className={styles.addressDisplay}>
          {getShortAddress(id)}
          <CopyToClipboard text={id}>
            <img
              src={ICON_COPY}
              className={styles.copyIcon}
              onClick={_onCopy}
            />
          </CopyToClipboard>
        </div>
      )}
    </div>
    <div>
      <div className={styles.qrCodeCont}>
        <QRCode
          bgColor="#0000"
          fgColor="#DDD"
          size={184}
          value={id || 'xxx'}
        />
      </div>
    </div></>
export default withRouter(WalletReceiveTokens);