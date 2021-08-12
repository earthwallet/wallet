import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.scss';
import ICON_ICP_DETAILS from '~assets/images/icon_icp_details.png';
import InputWithLabel from '~components/InputWithLabel';
import NextStepButton from '~components/NextStepButton';
import Warning from '~components/Warning';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import clsx from 'clsx';
import { RouteComponentProps, withRouter } from 'react-router';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';
import { getBalance, send } from '@earthwallet/sdk';
import Secp256k1KeyIdentity from '@earthwallet/sdk/build/main/util/icp/secpk256k1/identity';
import { isJsonString } from '~utils/common';
import { principal_id_to_address, address_to_hex } from '@earthwallet/sdk/build/main/util/icp';

import { decryptString } from '~utils/vault';


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


  const onNextStep = useCallback(() => { setStep1(false); }, []);
  const onBackClick = useCallback(() => { setStep1(true); }, []);
  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<any | null | keyable>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState(false);
  const [paymentHash, setPaymentHash] = useState<string>('');
  const selectedNetwork = 'ICP';

  const getICPUSDValue = async () => {
    const fetchHeaders = new Headers();

    fetchHeaders.append('accept', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: fetchHeaders,
      redirect: 'follow'
    };

    const factor: keyable = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd', requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    setUsdValue(parseFloat(factor['internet-computer'].usd));
  };

  const loadBalance = async (address: string) => {
    setLoading(true);
    const balance: keyable = await getBalance(address, 'ICP');

    setLoading(false);

    if (balance && balance?.balances != null) { setWalletBalance(balance); }
  };

  useEffect(() => {


    if (selectedAccount && selectedAccount?.id) {
      loadBalance(selectedAccount?.id);
      getICPUSDValue();
    }
  }, [selectedAccount]);


  const sendTx = async () => {
    setIsBusy(true);

    let json_secret = '';

    try {
      json_secret = decryptString(selectedAccount?.vault.encryptedJson, pass);
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    if (isJsonString(json_secret)) {
      const currentIdentity = Secp256k1KeyIdentity.fromJSON(json_secret);
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

        await loadBalance(address);
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

      let json_secret = '';
      try {
        json_secret = decryptString(selectedAccount?.vault.encryptedJson, password);
      }
      catch (error) {
        setError('Wrong password! Please try again');
      }

      if (!isJsonString(json_secret)) {
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
                  src={ICON_ICP_DETAILS}
                />
                <div className={styles.tokenSelectionLabelDiv}>
                  <div className={styles.tokenLabel}>{selectedNetwork}</div>
                  <div className={styles.tokenBalance}>
                    {loading
                      ? <SkeletonTheme color="#222"
                        highlightColor="#000">
                        <Skeleton width={150} />
                      </SkeletonTheme>
                      : <span className={styles.tokenBalanceText}>Balance: {walletBalance && walletBalance?.balances[0] &&
                        `${walletBalance?.balances[0]?.value / Math.pow(10, walletBalance?.balances[0]?.currency?.decimals)} 
                        ${walletBalance?.balances[0]?.currency?.symbol}`
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
              src={ICON_ICP_DETAILS}
            />
            <div className={styles.tokenText}>Internet Computer</div>
            <div className={styles.tokenAmount}>{selectedAmount} ICP</div>
            <div className={styles.tokenValue}>${(selectedAmount * usdValue).toFixed(3)}</div>

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
