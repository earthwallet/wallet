
import React, { useState } from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import ICON_EARTH from '~assets/images/icon-512.png';

interface Props extends RouteComponentProps<{ address: string }> {
}


const TokenHistory = ({
  match: {
    params: { address },
  },
}: Props) => {

  console.log(address);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={'Swap'}
      ><div className={styles.empty} /></Header>
      <div>
        <div className={styles.etxt}>Earth Wallet connects you to the fastest,
          most secure decentralized exchange protocols in the world.</div>
        <div>
          <div className={styles.etxt}>Balance : <span className={styles.etxtbalance}>1337 EARTH</span>
            <div className={styles.maxbtn}>Max</div>
          </div>
        </div>
        <div className={styles.sinput}>
          <div className={styles.econt}>
            <img className={styles.eicon} src={ICON_EARTH}></img>
            <div>EARTH</div>
          </div>
          <div>
            <input
              autoCapitalize='off'
              autoCorrect='off'
              autoFocus={false}
              key={'price'}
              max="1.00"
              min="0.00"
              onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
              placeholder="up to 8 decimal"
              required
              step="0.001"
              type="number"
              value={selectedAmount}
              className={styles.einput}></input>
          </div>
        </div>
        <div className={styles.sinput}>
          <div className={styles.label}>Select an asset</div>
        </div>
      </div>
    </div>
  );
};


export default withRouter(TokenHistory);