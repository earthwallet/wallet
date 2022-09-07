import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import Header from '~components/Header';
import ICON_ICP from '~assets/images/icon_icp_details.png';
import { keyable } from '~scripts/Background/types/IMainController';
import { getPopupTxn, selectAssetBySymbol } from '~state/assets';
import { getSymbol, isJsonString, PASSWORD_MIN_LENGTH } from '~utils/common';
import styles from './index.scss';
import NextStepButton from '~components/NextStepButton';
import InputWithLabel from '~components/InputWithLabel';
import { decryptString } from '~utils/vault';
import { selectAccountById } from '~state/wallet';
import { validateMnemonic } from '@earthwallet/keyring';
import Warning from '~components/Warning';
//import useToast from '~hooks/useToast';
import { useController } from '~hooks/useController';
import swapCircle from '~assets/images/swapLoadingCircle.svg';


import ICON_DOWN from '~assets/images/icon_down.svg';
import { getTokenInfo } from '~global/tokens';



interface Props extends RouteComponentProps<{ txnId: string }> {
}

const TransactionConfirm = ({
  match: {
    params: { txnId },
  },
}: Props) => {
  const txnStatusObj: keyable = useSelector(getPopupTxn(txnId));

  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [pass, setPass] = useState('');
  // const [loading, setLoading] = useState(false);
  const selectedAccount = useSelector(selectAccountById(txnStatusObj?.address));

  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol("ICP")?.coinGeckoId || ''));
  const usdValue = currentUSDValue?.usd;
  //const { show } = useToast();
  const controller = useController();
  const history = useHistory();

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');

      let secret = '';
      try {
        secret = selectedAccount?.symbol !== 'ICP'
          ? decryptString(selectedAccount?.vault.encryptedMnemonic, password)
          : decryptString(selectedAccount?.vault.encryptedJson, password);
      }
      catch (error) {
        setError('Wrong password! Please try again');
      }
      if (selectedAccount?.symbol === 'ICP' ? !isJsonString(secret) : !validateMnemonic(secret)) {
        setError('Wrong password! Please try again');
      }
      else {
        setError('NO_ERROR');
      }
    }
    , [selectedAccount]);


  const handleSign = async () => {
    setIsBusy(true);
    //    setLoading(true);
    let secret = '';

    try {
      secret = decryptString(selectedAccount?.vault.encryptedJson, pass);
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    if (isJsonString(secret)) {
      const callback = (path: string) => history.replace(path);
      controller.tokens.mintToken(txnId, secret, callback).then(() => {
        setIsBusy(false);
      });
    }
  };

  return (
    <div className={styles.page}>
      <Header
        className={styles.header}
        showMenu
        type={'wallet'}
        text={txnStatusObj?.loading ? 'Minting..' : 'Confirm ' + txnStatusObj?.type}
      ><div className={styles.empty} /></Header>
      {txnStatusObj?.loading
        ? <Settling {...txnStatusObj} icon={getTokenInfo(txnStatusObj?.params?.to)?.icon} />
        : <div className={styles.scrollCont}>
          {txnStatusObj?.error && <div className={styles.errorResponse}>{txnStatusObj?.error}</div>}

          <div className={styles.swapCont}>
            <div className={styles.swap}>
              <div className={styles.swapAmount}>{txnStatusObj?.params?.fromAmount}</div>
              <img src={ICON_ICP} className={styles.swapIcon} />
              <div className={styles.swapTxt}>{txnStatusObj?.params?.from}</div>
            </div>
            <div className={styles.swapArrow} >
              <img src={ICON_DOWN} className={styles.swapArrowIcon} /></div>
            <div className={styles.swapBelow}>
              <div className={styles.swapBelowIcon}>{getTokenInfo(txnStatusObj?.params?.to)?.icon ? <img className={styles.swapToIcon} src={getTokenInfo(txnStatusObj?.params?.to)?.icon}></img> : <div className={styles.swapToIcon}>{getTokenInfo(txnStatusObj?.params?.to)?.symbol?.charAt(0)}</div>}</div>
              <div className={styles.swapBelowTxt}>{getTokenInfo(txnStatusObj?.params?.to).name}</div>
              <div className={styles.swapBelowVal}>{(txnStatusObj?.params?.pairRatio * (txnStatusObj?.params?.fromAmount - getTokenInfo(txnStatusObj?.params?.to).fees))?.toFixed(3) || '-'} {getTokenInfo(txnStatusObj?.params?.to)?.symbol}</div>
              <div className={styles.swapBelowUsd}>${(usdValue * txnStatusObj?.params?.fromAmount)?.toFixed(2)}</div>
            </div>
          </div>
          <div className={styles.internetCompWrapContainer}>
            {/*     <div className={styles.imgCont}>
              <img src={getTokenImageURL(asset)} className={styles.ethIconContainer}></img>
            </div>
            <div className={styles.ethTextContainer}>
              <span className={styles.ethereumText}>{index}</span>
              <span className={styles.ethVal}>{price / Math.pow(10, 8)} ICP</span>
              <span className={styles.usdText}>${(price * usdValue / Math.pow(10, 8)).toFixed(3)}</span>
            </div> */}
            <div className={styles.earthFeeContainer}>
              <span className={styles.earthFeeText}>Network Fee</span>
              <div className={styles.earthFeeRightSideContainer}>
                <span className={styles.earthVal}>{getTokenInfo(txnStatusObj?.params?.to).fees} ICP</span>
                <span className={styles.convertedVal}>${(getTokenInfo(txnStatusObj?.params?.to).fees * usdValue).toFixed(3)}</span>
              </div>
            </div>
            <div className={styles.gasFeeContainer}>
              <div className={styles.leftSideContainer}>
                <span className={styles.gasFeeText}>DEX Fee</span>
              </div>
              <div className={styles.rightSideContainer}>
                <span className={styles.earthText}>Free</span>
                <span className={styles.convertedVal}>$0.00</span>
              </div>
            </div>

            <div className={styles.totalContainer}>
              <span className={styles.totalText}>Total</span>
              <div className={styles.rightSideTotalContainer}>
                <span className={styles.totalEarthVal}>{txnStatusObj?.params?.fromAmount} ICP</span>
                <span className={styles.totalUSDVal}>${(txnStatusObj?.params?.fromAmount * usdValue).toFixed(3)}</span>
              </div>
            </div>
          </div>

        </div>}
      {txnStatusObj?.loading ? <div /> : <section className={styles.footer}>
        <InputWithLabel
          data-export-password
          disabled={isBusy}
          isError={pass.length < PASSWORD_MIN_LENGTH
            || !!error}
          label={'password for this account'}
          onChange={onPassChange}
          placeholder='REQUIRED'
          type='password'
        />
        {false && error && error != 'NO_ERROR' && (
          <Warning
            isBelowInput
            isDanger
          >
            {error}
          </Warning>
        )}
        <div className={styles.actions}>
          <NextStepButton
            loading={isBusy}
            disabled={error != 'NO_ERROR'}
            onClick={() => handleSign()}>
            {txnStatusObj?.type == 'mint' ? 'Mint' : txnStatusObj?.type}
          </NextStepButton>
        </div>
      </section>}

    </div>
  );
};


const Settling = (props: keyable) => {

  return (
    <div className={styles.settleContainer}>
      <img src={swapCircle} className={styles.swapCircleImg} />
      <img src={props.icon} className={styles.nftLoadingImg}></img>
      <span className={styles.quoteText}>Step {props.current} of {props.total}</span>
      <span className={styles.submittingText}>{props.status}</span>
      <div className={styles.progressBar}>
        <div className={styles.leftSide} style={{ width: ((270 / props.total) * props.current) }}></div>
        <div className={styles.rightSide} style={{ width: ((270 / props.total) * (props.total - props.current)) }}></div>
      </div>
    </div>
  );
};

export default withRouter(TransactionConfirm);
