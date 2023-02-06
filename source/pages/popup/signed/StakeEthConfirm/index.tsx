import React, { useCallback, useState } from 'react';
import styles from './index.scss';
import downArrow from '~assets/images/downArrow.svg';
import useQuery from '~hooks/useQuery';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAssetBySymbol } from '~state/assets';
import { getSymbol, isJsonString } from '~utils/common';
import Header from '~components/Header';
// @ts-ignore
import ICON_ROCKETPOOL from '~assets/images/icon_rocketpool.jpg';
import ICON_ETH from '~assets/images/icon_eth.png';
import { decryptString } from '~utils/vault';
import { validateMnemonic } from '@earthwallet/keyring';
import { ClipLoader } from 'react-spinners';
import ActionButton from '~components/composed/ActionButton';
import InputWithLabel from '~components/InputWithLabel';
import Warning from '~components/Warning';
import { useHistory } from 'react-router-dom';
import { transferUniswap } from '~utils/services';
import useToast from '~hooks/useToast';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ accountId: string }> {
}
const MIN_LENGTH = 6;

const StakeEthConfirm = ({
  match: {
    params: { accountId },
  },
}: Props) => {
  const queryParams = useQuery();

  const selectedAccount = useSelector(selectAccountById(accountId));
  const { symbol } = selectedAccount || {};
  const currentUSDValue: keyable = useSelector(
    selectAssetBySymbol(getSymbol(symbol)?.coinGeckoId || "")
  );
  const uniswap = JSON.parse(queryParams.get('params') || '{}')?.uniswap;
  const usd = currentUSDValue?.usd;
  const ratio = uniswap?.inputAmount / uniswap?.outputAmount;
  const gas = (uniswap?.estimatedGasUsedUSDTxt / usd);
  const earthFees = 0;
  const selectedAmount = uniswap?.inputAmount || 0;
  const [error, setError] = useState('');
  const [pass, setPass] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [hash, setHash] = useState('');

  const history = useHistory();
  const { show } = useToast();

  const handleCancel = () => {
    history.replace('/account/details/' + selectedAccount.id)
  };

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');

      let secret = '';
      try {
        secret =
          selectedAccount?.symbol !== 'ICP'
            ? decryptString(selectedAccount?.vault.encryptedMnemonic, password)
            : decryptString(selectedAccount?.vault.encryptedJson, password);
      } catch (error) {
        setError(i18nT('common.wrongPass'));
      }
      if (
        selectedAccount?.symbol === 'ICP'
          ? !isJsonString(secret)
          : !validateMnemonic(secret)
      ) {
        setError(i18nT('common.wrongPass'));
      } else {
        setError('NO_ERROR');
      }
    },
    [selectedAccount]
  );

  const sign = async () => {
    setIsBusy(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    const mnemonic = decryptString(selectedAccount?.vault?.encryptedMnemonic, pass);
    if (uniswap?.outputToken == "ETH") {
      setIsBusy(false);
      try {

        const txn = await transferUniswap(uniswap, selectedAccount.address, mnemonic, selectedAccount.symbol)

        setHash(txn?.hash)
        show("Unstake request submitted successfully!")

      } catch (error) {
        setIsBusy(false);
        alert(error);
      }
    } else {
      try {
        const txn = await transferUniswap(uniswap, selectedAccount.address, mnemonic, selectedAccount.symbol)
        setHash(txn?.hash)

        show("Stake request submitted successfully!")

      } catch (error) {
        setIsBusy(false);
        alert(error);
      }
    }


  }
  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={uniswap?.outputToken == "ETH"
          ? "Unstake ETH" : "Stake ETH"}
      ><div className={styles.empty} /></Header>

      <div className={styles.ethWrapContainer}>
        <span style={{ textAlign: 'right' }} className={styles.ethWrapText}>{uniswap?.inputAmount}</span>
        <img src={uniswap?.outputToken == "ETH" ? ICON_ROCKETPOOL : ICON_ETH} className={styles.logo} />
        <span className={styles.ethWrapText}>{uniswap?.outputToken == "ETH" ? "rETH" : "ETH"}</span>
      </div>
      <div className={styles.downArrowContainer}>
        <img src={downArrow} />
      </div>
      <div className={styles.internetCompWrapContainer}>
        <div className={styles.ethIconContainer}><img src={uniswap?.outputToken != "ETH" ? ICON_ROCKETPOOL : ICON_ETH} className={styles.biglogo} /></div>
        <div className={styles.ethTextContainer}>
          <span className={styles.ethereumText}>{uniswap?.outputToken == "ETH" ? "Ethereum" : "Rocket Pool ETH"}</span>
          <span className={styles.ethVal}>{parseFloat(uniswap?.outputAmount).toFixed(5)} {uniswap?.outputToken == "ETH" ? "ETH" : "rETH"}</span>
          <span className={styles.usdText}>${uniswap?.outputToken == "ETH" ? (uniswap?.inputAmount * 1 / ratio * usd).toFixed(2) : (uniswap?.inputAmount * usd).toFixed(2)}</span>
          {uniswap?.outputToken == "ETH" ? <span className={styles.conversionText}>1 rETH = {(1 / ratio).toFixed(5)} ETH</span> : <span className={styles.conversionText}>1 ETH = {(1 / ratio).toFixed(5)} rETH</span>}

        </div>
        <div className={styles.gasFeeContainer}>
          <div className={styles.leftSideContainer}>
            <span className={styles.gasFeeText}>Estimated Gas Fee</span>
          </div>
          <div className={styles.rightSideContainer}>
            <span className={styles.earthText}>{gas?.toFixed(5)} ETH</span>
            <span className={styles.convertedVal}>${uniswap?.estimatedGasUsedUSDTxt}</span>
          </div>
        </div>
        <div className={styles.totalContainer}>
          <span className={styles.totalText}>Total</span>
          <div className={styles.rightSideTotalContainer}>
            <span className={styles.totalEarthVal}>{((selectedAmount * 1 / ratio) + gas + earthFees).toFixed(5)} ETH</span>
            <span className={styles.totalUSDVal}>${((parseFloat(selectedAmount) + gas + earthFees) * usd).toFixed(2)}</span>
          </div>
        </div>
      </div>
      {isBusy ? (
        <section className={styles.footerSuccess}>
          <ClipLoader color={'#fffff'} size={15} />
        </section>
      ) : (hash != '') ? (
        <section className={styles.footerSuccess}>
          <ActionButton onClick={() => history.replace('/account/details/' + selectedAccount.id)
          }>
            &nbsp;&nbsp;&nbsp;Transaction Complete!&nbsp;&nbsp;&nbsp;
          </ActionButton>
        </section>
      ) : (
        <section className={styles.footer}>
          <InputWithLabel
            data-export-password
            disabled={isBusy}
            isError={pass.length < MIN_LENGTH || !!error}
            label={i18nT('common.passwordForAc')}
            onChange={onPassChange}
            placeholder={i18nT('common.requiredPlaceholder')}
            type="password"
          />
          {error && error != 'NO_ERROR' && (
            <Warning isBelowInput isDanger>
              {error}
            </Warning>
          )}
          <div className={styles.actions}>
            <ActionButton actionType="secondary" onClick={handleCancel}>
              Cancel
            </ActionButton>
            <ActionButton
              disabled={error != 'NO_ERROR'}
              onClick={
                () => sign()
              }
            >
              {uniswap?.outputToken == "ETH" ? "Unstake" : "Stake"}
            </ActionButton>
          </div>
        </section>
      )}
    </div>
  );
};

export default withRouter(StakeEthConfirm);
