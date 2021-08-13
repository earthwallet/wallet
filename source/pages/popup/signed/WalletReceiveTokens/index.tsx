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

interface Props extends RouteComponentProps<{ address: string }> {
}
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
      <div>
        <div className={styles.accountShare}>Share your Public Address</div>
        <div className={styles.accountDetail}>
          {selectedAccount?.id && (
            <div className={styles.addressDisplay}>
              {getShortAddress(selectedAccount?.id)}
              <CopyToClipboard text={selectedAccount?.id}>
                <img src={ICON_COPY} className={styles.copyIcon} onClick={_onCopy} />
              </CopyToClipboard>
            </div>
          )}

          <div className={styles.qrCodeCont}>
            <QRCode
              bgColor="#0000"
              fgColor="#DDD"
              size={184}
              value={selectedAccount?.id || 'xxx'}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '0 27px',
          marginBottom: 30,
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
    </div>
  );
};

export default withRouter(WalletReceiveTokens);
