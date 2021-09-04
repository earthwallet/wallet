import React, { useCallback, useState } from 'react';

//import { useHistory } from 'react-router-dom';
import styles from './index.scss';
import HeaderWithSteps from '~components/HeaderWithSteps';
import SeedAndPath from './SeedAndPath';
import AccountNamePasswordCreation from './AccountNamePasswordCreation';
import { useController } from '~hooks/useController';
import { useHistory } from 'react-router-dom';
import { LIVE_SYMBOLS } from '~global/constant';
import { ClipLoader } from 'react-spinners';
import { getSymbol } from '~utils/common';
import ICON_NOTICE from '~assets/images/icon_notice.svg';


const Page = () => {
  //  const history = useHistory();
  const [seed, setSeed] = useState<string | null>(null);
  const [step, setStep] = useState<string>('1');
  const [balance, setBalance] = useState<number>(0);
  const [isBusy, setIsBusy] = useState(false);
  const controller = useController();
  const history = useHistory();

  const _onNextStep = useCallback(() => {

    seed !== null && controller.accounts
      .migrateExistingICP(seed)
      .then((keypair) => {
        console.log(keypair, 'importseed');
        if (keypair?.balance?.balances[0]?.value > 0) {
          setBalance(keypair?.balance?.balances[0]?.value
            / Math.pow(10, keypair?.balance.balances[0].currency.decimals));
          setStep('1a');
        } else {
          setStep('2');
        }
      });

  }, [seed !== null]);
  const _onBackClick = useCallback(() => {
    setStep('1');
  }, []);



  const _onCreate = useCallback((name: string, password: string): void => {

    // this should always be the case
    if (name && password && seed) {
      setIsBusy(true);
      const callback = (address: string) => history.replace('/portfolio?hightlight=' + address);

      controller.accounts
        .createOrUpdateAccounts(seed, LIVE_SYMBOLS, name, password, callback)
        .then(() => {
        });
    }
  }, [seed]);


  const getStepComponent = (step: string) => {
    switch (step) {
      case '1':
        return <div>
          <div className={styles.earthInputCont}>
            <div className={styles.labelText}>
              Enter your Mnemonic Seed phrase
            </div>
            <SeedAndPath
              onSeedChange={setSeed}
              onNextStep={_onNextStep}
            />
          </div>
        </div>;
      case '1a':
        return < >
          <div className={styles.noticeCont}>
            <div className={styles.noticeTitle}>
              Migrate your ICP account
              <img src={ICON_NOTICE} className={styles.noticeIcon}></img>
              <div className={styles.noticeSubTitle}>Internet Computer - ICP recommends you use new Secp256k1 address instead of old Ed25519 address. Your balance of {balance} ICP shall be transferred to new address.</div>
            </div>
            <div>
              <div className={styles.notAddr}>Old Address</div>
              <div className={styles.notAddrCont}>
                <img src={getSymbol('ICP')?.icon} className={styles.notAddrIcon}></img>
                <div className={styles.notAddrText}>0x48c8c69e2571e0...</div>
              </div>
              <div className={styles.notAddr}>New Address</div>
              <div className={styles.notAddrCont}>
                <img src={getSymbol('ICP')?.icon} className={styles.notAddrIcon}></img>
                <div className={styles.notAddrText}>0x48c8c69e2571e0...</div>
              </div>

            </div>
          </div>
          <div
            style={{
              margin: '0px 24px 24px',
              position: 'absolute',
              bottom: 0,
              left: 0,
              display: 'flex'
            }}
          >
            <div
              onClick={() => setStep('2')}
              className={styles.secButton}>Skip</div>
            <div
              onClick={() => setStep('2')}
              className={styles.primButton}>Next</div>
          </div>
        </ >;
      case '2':
        return <AccountNamePasswordCreation
          buttonLabel={'Add account'}
          isBusy={isBusy}
          onBackClick={_onBackClick}
          onCreate={_onCreate}
        />;
      default:
        return <ClipLoader color={'#fffff'}
          size={15} />
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pagecont}>
        <HeaderWithSteps
          backOverride={step === '1' ? undefined : _onBackClick}
          step={step}
          text={'Import account'}
        />
        {getStepComponent(step)}
      </div>
    </div>
  );
};

export default Page;
