import React from 'react';
import styles from './index.scss';
import { getShortAddress } from '~utils/common';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import Header from '~components/Header';
import QRCode from 'qrcode.react';
import NextStepButton from '~components/NextStepButton';

const Page = () => {
  const history = useHistory();
  const selectedAccount = { address: '5xxx', name: 'assd' };

  return <div className={styles.page}>
    <Header
      showAccountsDropdown
      showMenu
      type='wallet' />
    <div >
      <div className={styles.accountShare}>Share your Public Address</div>
      <div className={styles.accountDetail}>

        {selectedAccount?.address && <div className={styles.addressDisplay}>
          {getShortAddress(selectedAccount?.address)}
          <CopyToClipboard
            text={selectedAccount?.address} >
            <div>Copy</div>
          </CopyToClipboard> </div>}

        <div
          className={styles.qrCodeCont}>
          <QRCode bgColor='#0000'
            fgColor='#DDD'
            size={220}
            value={selectedAccount?.address || 'xxx'} />
        </div>
      </div>

    </div>
    <div style={{
      padding: '0 27px',
      marginBottom: 30,
      position: 'absolute',
      bottom: 0,
      left: 0
    }}>
      <NextStepButton
        disabled={false}
        onClick={() => history.push(`/account/export/${selectedAccount?.address || ''}`)}
      >
        {'Export Account'}
      </NextStepButton>
    </div>
  </div>;
};

export default Page;
