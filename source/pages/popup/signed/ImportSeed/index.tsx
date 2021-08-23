import React, { useCallback, useState } from 'react';

//import { useHistory } from 'react-router-dom';
import styles from './index.scss';
import HeaderWithSteps from '~components/HeaderWithSteps';
import SeedAndPath from './SeedAndPath';
import AccountNamePasswordCreation from './AccountNamePasswordCreation';
import { useController } from '~hooks/useController';
import { useHistory } from 'react-router-dom';
import { LIVE_SYMBOLS } from '~global/constant';


const Page = () => {
  //  const history = useHistory();
  const [seed, setSeed] = useState<string | null>(null);
  const [step1, setStep1] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const controller = useController();
  const history = useHistory();

  const _onNextStep = useCallback(() => {
    setStep1(false);
  }, []);
  const _onBackClick = useCallback(() => {
    setStep1(true);
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



  return (
    <div className={styles.page}>
      <div className={styles.pagecont}>
        <HeaderWithSteps
          backOverride={step1 ? undefined : _onBackClick}
          step={step1 ? 1 : 2}
          text={'Import account'}
        />
        {step1 ? (
          <div>
            <div className={styles.earthInputCont}>
              <div className={styles.labelText}>
                Enter your Mnemonic Seed phrase
              </div>
              <SeedAndPath
                onSeedChange={setSeed}
                onNextStep={_onNextStep}
              />
            </div>
          </div>
        ) : (
          <AccountNamePasswordCreation
            buttonLabel={'Add account'}
            isBusy={isBusy}
            onBackClick={_onBackClick}
            onCreate={_onCreate}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
