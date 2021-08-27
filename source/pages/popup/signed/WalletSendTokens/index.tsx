import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.scss';
import InputWithLabel from '~components/InputWithLabel';
import NextStepButton from '~components/NextStepButton';
import Warning from '~components/Warning';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import clsx from 'clsx';
import { RouteComponentProps, withRouter } from 'react-router';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';
import { send } from '@earthwallet/keyring';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { isJsonString } from '~utils/common';
import { principal_id_to_address, address_to_hex } from '@earthwallet/keyring/build/main/util/icp';
import { getSymbol } from '~utils/common';

import { decryptString } from '~utils/vault';
import { validateMnemonic } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceByAddress } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';


const MIN_LENGTH = 6;

interface keyable {
  [key: string]: any
}

interface Props extends RouteComponentProps<{ address: string }> {
}

const WalletSendTokens = ({
  match: {
    params: { address },
  },
}: Props) => {

  const [step1, setStep1] = useState(true);
  const selectedAccount = useSelector(selectAccountById(address));
  const controller = useController();
  const currentBalance: keyable = useSelector(selectBalanceByAddress(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));


  const onNextStep = useCallback(() => { setStep1(false); }, []);
  const onBackClick = useCallback(() => { setStep1(true); }, []);
  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [selectCredit, setSelectCredit] = useState<boolean>(true);

  const [isBusy, setIsBusy] = useState(false);
  const [paymentHash, setPaymentHash] = useState<string>('');

  useEffect(() => {

    controller.accounts
      .getBalancesOfAccount(selectedAccount)
      .then(() => {
      });

    /*  if (selectedAccount && selectedAccount?.id) {
       loadBalance(selectedAccount?.id);
       getICPUSDValue();
     } */
  }, [selectedAccount?.id === address]);


  const sendTx = async () => {
    setIsBusy(true);

    let secret = '';

    try {
      secret = decryptString(selectedAccount?.vault.encryptedJson, pass);
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    if (isJsonString(secret)) {
      const currentIdentity = Secp256k1KeyIdentity.fromJSON(secret);
      const address = address_to_hex(
        principal_id_to_address(currentIdentity.getPrincipal())
      );

      setLoadingSend(true);

      try {
        if (selectedAmount === 0) {
          alert('Amount cannot be 0');
        }

        const hash: any = await send(
          currentIdentity,
          selectedRecp,
          address,
          selectedAmount,
          'ICP'
        );

        await controller.accounts
          .getBalancesOfAccount(selectedAccount)
          .then(() => {
          });
        setLoadingSend(false);
        setPaymentHash(hash || '');
        setIsBusy(false);
      } catch (error) {
        console.log(error);
        setLoadingSend(false);
        setIsBusy(false);
      }
    } else {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    return true;
  };

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');

      let secret = '';
      try {
        secret = selectedAccount.symbol !== 'ICP'
          ? decryptString(selectedAccount?.vault.encryptedMnemonic, password)
          : decryptString(selectedAccount?.vault.encryptedJson, password);
      }
      catch (error) {
        setError('Wrong password! Please try again');
      }
      console.log(secret, selectedAccount?.vault.encryptedJson, selectedAccount, 'onPassChange');
      if (selectedAccount.symbol === 'ICP' ? !isJsonString(secret) : !validateMnemonic(secret)) {
        setError('Wrong password! Please try again');
      }
    }
    , [selectedAccount]);

  return <div className={styles.page}><>
    <Header
      backOverride={step1 ? undefined : paymentHash === '' ? onBackClick : undefined}
      centerText
      showMenu
      text={'Send'}
      type={'wallet'} />
    <div className={styles.pagecont}
      ref={dropDownRef}
    >
      {!(paymentHash === undefined || paymentHash === '') && <div

        className={styles.paymentDone}>
        Payment Done! Check transactions for more details.
      </div>}
      {step1
        ? <div style={{ width: '100vw' }}>
          <div className={styles.earthInputLabel}>Add recipient</div>
          <input
            autoCapitalize='off'
            autoCorrect='off'
            autoFocus={true}
            className={clsx(styles.earthinput, styles.recipientAddress)}
            key={'recp'}
            onChange={(e) => setSelectedRecp(e.target.value)}
            placeholder="Recipient address"
            required
            value={selectedRecp}
          />
          <div className={styles.assetSelectionDivCont}>
            <div className={styles.earthInputLabel}>
              Asset
            </div>
            <div className={styles.tokenSelectionDiv}>
              <div className={styles.selectedNetworkDiv}>
                <img
                  className={styles.tokenLogo}
                  src={getSymbol(selectedAccount.symbol)?.icon}
                />
                <div className={styles.tokenSelectionLabelDiv}>
                  <div className={styles.tokenLabel}>{selectedAccount.symbol}</div>
                  <div className={styles.tokenBalance}>
                    {currentBalance?.loading
                      ? <SkeletonTheme color="#222"
                        highlightColor="#000">
                        <Skeleton width={150} />
                      </SkeletonTheme>
                      : <span className={styles.tokenBalanceText}>Balance: {currentBalance &&
                        `${currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)} 
                        ${currentBalance?.currency?.symbol}`
                      }</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.earthInputLabel}>
            Amount
          </div>
          <input
            autoCapitalize='off'
            autoCorrect='off'
            autoFocus={false}
            className={clsx(styles.recipientAddress, styles.earthinput)}
            key={'amount'}
            max="1.00"
            min="0.00"
            onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
            placeholder="amount up to 8 decimal places"
            required
            step="0.001"
            type="number"
            value={selectedAmount}
          />
        </div>
        : <div className={styles.confirmPage}>
          <div className={styles.confirmAmountCont}>
            <img
              className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
              src={getSymbol(selectedAccount.symbol)?.icon}
            />
            <div>
              <div className={styles.tokenText}>{getSymbol(selectedAccount.symbol)?.name}</div>
              <div className={styles.tokenAmount}>{selectedAmount} {selectedAccount.symbol}</div>
              <div className={styles.tokenValue}>${(selectedAmount * currentUSDValue?.usd).toFixed(3)}</div>
            </div>

          </div>
          <div className={styles.feeCont}>
            <div className={styles.feeRow}>
              <div className={styles.feeTitle}>Transaction Fee</div>
              <div>
                <div className={styles.feeAmount}>0.001 {selectedAccount.symbol}</div>
                <div className={styles.feeValue}>$6.52</div>
              </div>
            </div>
            {selectCredit && <div className={styles.feeRow}>
              <div className={styles.feeTitle}>Earth Credit<span
                onClick={() => setSelectCredit(false)}
                className={styles.removeBtn}>Remove</span></div>
              <div>
                <div className={styles.feeAmount}>You Recieve</div>
                <div className={styles.feeValue}>1.50 EARTH</div>
              </div>
            </div>}
            <div className={styles.feeRow}>
              <div className={styles.feeTotal}>Total</div>
              <div>
                <div className={styles.feeAmount}>{selectedAmount + 0.001}</div>
                <div className={styles.feeValue}>${((selectedAmount + 0.001) * currentUSDValue?.usd).toFixed(3)}</div>
              </div>
            </div>

          </div>
          <InputWithLabel
            data-export-password
            disabled={isBusy}
            isError={pass.length < MIN_LENGTH || !!error}
            label={'password for this account'}
            onChange={onPassChange}
            placeholder='REQUIRED'
            type='password'
          />
          {error && (
            <Warning
              isBelowInput
              isDanger
            >
              {error}
            </Warning>
          )}
        </div>}
    </div>
    <div style={{
      padding: '0 27px',
      marginBottom: 30,
      position: 'absolute',
      bottom: 0,
      left: 0
    }}>
      {step1
        ? <NextStepButton
          disabled={loadingSend || !selectedRecp}
          loading={isBusy}
          onClick={onNextStep}>
          {'Next'}
        </NextStepButton>

        : <NextStepButton
          disabled={loadingSend || !!error || pass.length < MIN_LENGTH}
          loading={isBusy || loadingSend}
          onClick={() => sendTx()}>
          {'Send'}
        </NextStepButton>}
    </div>
  </></div>;
};

export default withRouter(WalletSendTokens);
