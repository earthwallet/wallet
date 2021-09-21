import React, { useCallback, useState } from 'react';

//import { useHistory } from 'react-router-dom';
import styles from './index.scss';
import HeaderWithSteps from '~components/HeaderWithSteps';
import SeedAndPath from './SeedAndPath';
import AccountNamePasswordCreation from './AccountNamePasswordCreation';
import { useController } from '~hooks/useController';
import { useHistory } from 'react-router-dom';
import { DEFAULT_ICP_FEES, PREGENERATE_SYMBOLS } from '~global/constant';
import { ClipLoader } from 'react-spinners';
import { getSymbol } from '~utils/common';
import ICON_NOTICE from '~assets/images/icon_notice.svg';
import { keyable } from '~scripts/Background/types/IMainController';
import { principal_id_to_address, address_to_hex } from '@earthwallet/keyring/build/main/util/icp';
import { createWallet } from '@earthwallet/keyring';
import { send } from '@earthwallet/keyring';
import Warning from '~components/Warning';
import ICON_GREEN_TICK from '~assets/images/icon_green_tick.svg';


const Page = () => {
  //  const history = useHistory();
  const [seed, setSeed] = useState<string | null>(null);
  const [step, setStep] = useState<string>('1');
  const [balance, setBalance] = useState<number>(0);
  const [addresses, setAddresses] = useState<keyable>({ old: '', new: '' });
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [txError, setTxError] = useState('');
  const [migrateComplete, setMigrateComplete] = useState<boolean>(false);

  const [isBusy, setIsBusy] = useState(false);
  const controller = useController();
  const history = useHistory();

  const _onNextStep = useCallback(() => {

    seed !== null && controller.accounts
      .migrateExistingICP(seed)
      .then((keypairGroup) => {
        if (keypairGroup?.balance?.balances[0]?.value > 0) {
          setAddresses({ old: keypairGroup.keypair.address, new: keypairGroup.keypairNew.address });
          setBalance(keypairGroup?.balance?.balances[0]?.value
            / Math.pow(10, keypairGroup?.balance.balances[0].currency.decimals));
          setStep('1a');
        } else {
          setStep('2');
        }
      });

  }, [seed]);

  const sendICPFromOldToNew = useCallback(async () => {
    if (seed !== null) {
      const fees = DEFAULT_ICP_FEES;
      setLoadingSend(false);
      setTxError('');
      setMigrateComplete(false);
      const oldKeypair = await createWallet(seed.trim(), 'ICP', 0, {
        type: 'Ed25519',
      });
      const newKeypair = await createWallet(seed.trim(), 'ICP', 0);
      const currentIdentity = oldKeypair.identity;
      const address = address_to_hex(
        principal_id_to_address(currentIdentity.getPrincipal())
      );
      setLoadingSend(true);
      const selectedAmount = parseFloat((balance - fees).toFixed(8));
      try {

        const hash: any = await send(
          currentIdentity,
          newKeypair.address,
          address,
          selectedAmount,
          'ICP'
        );
        if (hash !== null) {
          setLoadingSend(false);
          setStep('2');
          setMigrateComplete(true);
        }

      } catch (error) {
        setTxError("Please try again later or Skip! Error: " + JSON.stringify(error));
        setLoadingSend(false);
        setMigrateComplete(false);

      }
    }

  }, [seed, balance]);


  const _onBackClick = useCallback(() => {
    setStep('1');
  }, []);




  const _onCreate = useCallback((name: string, password: string): void => {

    // this should always be the case
    if (name && password && seed) {
      setIsBusy(true);
      const callback = (address: string) => history.replace('/accounts?hightlight=' + address);

      controller.accounts
        .createOrUpdateAccounts(seed, PREGENERATE_SYMBOLS, name, password, [], callback)
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
                <div className={styles.notAddrText}>{addresses?.old}</div>
              </div>
              <div className={styles.notAddr}>New Address</div>
              <div className={styles.notAddrCont}>
                <img src={getSymbol('ICP')?.icon} className={styles.notAddrIcon}></img>
                <div className={styles.notAddrText}>{addresses?.new}</div>
              </div>

            </div>
          </div>
          {txError && (
            <div
              className={styles.noBalanceError}
            ><Warning
              isBelowInput
              isDanger
            >
                {txError}
              </Warning></div>
          )}
          {loadingSend ? <div
            style={{
              margin: '0px 24px 24px',
              position: 'absolute',
              bottom: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 330,
              height: 56,
            }}
          >
            <ClipLoader color={'#fffff'}
              size={15} />
          </div>
            : <div
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
                onClick={() => sendICPFromOldToNew()}
                className={styles.primButton}>Next</div>
            </div>}
        </ >;
      case '2':
        return <div>
          {migrateComplete && <div className={styles.migrateAnnon}>
            <img className={styles.migrateAnnonIcon} src={ICON_GREEN_TICK} />
            Migration is complete. Continue with import account{'>'} </div>}
          <AccountNamePasswordCreation
            buttonLabel={'Add account'}
            isBusy={isBusy}
            onBackClick={_onBackClick}
            onCreate={_onCreate}
          />
        </div>;
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
