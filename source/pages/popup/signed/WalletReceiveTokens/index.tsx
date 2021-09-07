import React from 'react';
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

interface Props extends RouteComponentProps<{ address: string }> {}
const WalletReceiveTokens = ({
  match: {
    params: { address },
  },
}: Props) => {
  const history = useHistory();
  const selectedAccount = useSelector(selectAccountById(address));
  const _onCopy = console.log;

  return (
    <div className={styles.page}>
      <Header showAccountsDropdown showMenu type="wallet" />
      <div className={styles.container}>
        <div className={styles.accountShare}>Share your Public Address</div>
        <div className={styles.accountDetail}>
          {selectedAccount?.id && (
            <div className={styles.addressDisplay}>
              {getShortAddress(selectedAccount?.id)}
              <CopyToClipboard text={selectedAccount?.id}>
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
              value={selectedAccount?.id || 'xxx'}
            />
          </div>
        </div>
        {selectedAccount?.meta?.principalId && <div className={styles.principalCont}>
          <div className={styles.accountShare}>Your Principal Id</div>
          <div className={styles.accountDetail}>
            <div className={styles.addressDisplay}>
              {getShortAddress(selectedAccount?.meta?.principalId)}
              <CopyToClipboard text={selectedAccount?.meta?.principalId}>
                <img src={ICON_COPY} className={styles.copyIcon} onClick={_onCopy} />
              </CopyToClipboard>
            </div>
          </div>
        </div>}
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
          {'Export Account'}
        </NextStepButton>
      </div>
    </div >
  );
};

export default withRouter(WalletReceiveTokens);
