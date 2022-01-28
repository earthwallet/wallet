
import React, { useState } from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import ICON_EARTH from '~assets/images/icon-512.png';
import ICON_CARET from '~assets/images/icon_caret.svg';
import ICON_SWAP from '~assets/images/icon_swap.svg';
import clsx from 'clsx';
import NextStepButton from '~components/NextStepButton';
import { useSelector } from 'react-redux';
import { selectTokenByTokenPair, selectTokensInfo, selectTokensInfoById } from '~state/token';
import { keyable } from '~scripts/Background/types/IAssetsController';

interface Props extends RouteComponentProps<{ address: string, tokenId: string }> {
}


const TokenHistory = ({
  match: {
    params: { address, tokenId },
  },
}: Props) => {

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const tokenInfo = useSelector(selectTokensInfoById(tokenId));
  const tokenPair = useSelector(selectTokenByTokenPair(address + "_WITH_" + tokenId));
  const tokenInfos = useSelector(selectTokensInfo);

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
          <div className={styles.etxt}>Balance : <span className={styles.etxtbalance}>{tokenPair.balance} {tokenInfo.symbol}</span>
            <div className={styles.maxbtn}>Max</div>
          </div>
        </div>
        <div className={clsx(styles.sinput, styles.firstInput)}>
          <div className={styles.econt}>
            {tokenInfo.icon ? <img className={styles.eicon} src={ICON_EARTH}></img> : <div className={styles.eicon}>{tokenInfo?.name?.charAt(0)}</div>}
            <div>{tokenInfo.symbol}</div>
            <img className={styles.careticon} src={ICON_CARET} />
          </div>
          <div className={styles.econtinput}>
            <input
              autoCapitalize='off'
              autoCorrect='off'
              autoFocus={false}
              key={'price'}
              max="1.00"
              min="0.00"
              onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
              placeholder="8 decimal"
              required
              step="0.001"
              type="number"
              value={selectedAmount}
              className={styles.einput}></input>
          </div>
          <div className={styles.swapbtn}><img src={ICON_SWAP} /></div>
        </div>
        <div className={styles.dropdownCont}>
          <div
            onClick={() => setOpen(true)}
            className={clsx(styles.sinput, styles.selectDropdown)}>
            <div className={styles.noicon} ></div>
            <div className={styles.label}>{selectedToken === 0 ? 'Select an asset' : `${selectedToken}`}</div>
            <img className={styles.careticon} src={ICON_CARET} />
          </div>
          {open && <div className={styles.tokenOptions}>
            {tokenInfos.filter((token: keyable) => token.id !== tokenId).map((token: keyable) => <div
              onClick={() => {
                setSelectedToken(token.symbol);
                setOpen(false);
              }}
              key={token.id}
              className={clsx(styles.sinput, styles.selectDropdown, styles.selectDropdownOption)}>
              <div className={styles.noicon} ></div>
              <div className={styles.label}>{token.symbol}</div>
            </div>)}
          </div>}
        </div>

        <div className={styles.txnBtnCont}><div className={styles.txnBtn}>Transaction Settings</div></div>
      </div>
      <div className={styles.nextCont}>
        <NextStepButton
          disabled={true}
          onClick={console.log}
        >
          {'Next: Review'}
        </NextStepButton>
      </div>
    </div>
  );
};


export default withRouter(TokenHistory);