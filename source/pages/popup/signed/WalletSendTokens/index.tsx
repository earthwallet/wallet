import React, { useCallback, useRef, useState } from 'react';
import styles from './index.scss';
import ICON_ICP_DETAILS from '~assets/images/icon_icp_details.png';
import InputWithLabel from '~components/InputWithLabel';
import NextStepButton from '~components/NextStepButton';
import Warning from '~components/Warning';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import clsx from 'clsx';


const MIN_LENGTH = 6;


const Page = () => {
  const [step1, setStep1] = useState(true);

  const onNextStep = useCallback(() => { setStep1(false); }, []);
  const onBackClick = useCallback(() => { setStep1(true); }, []);
  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loadingSend, setLoadingSend] = useState<boolean>(false);

  const loading = false;
  const usdValue = 13;
  const isBusy = false;
  const paymentHash = '';
  const selectedNetwork = 'ICP';

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      //todo
      setError('');
      setLoadingSend(false);
    }
    , []);

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
                      : <span className={styles.tokenBalanceText}>Balance: 123 ICP</span>
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
          onClick={() => console.log()}>
          {'Send'}
        </NextStepButton>}
    </div>
  </></div>;
};

export default Page;
