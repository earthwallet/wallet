import React, { useCallback, useState } from 'react';

//import { useHistory } from 'react-router-dom';
import styles from './index.scss';
import HeaderWithSteps from '~components/HeaderWithSteps';
import SeedAndPath from './SeedAndPath';
import AccountNamePasswordCreation from './AccountNamePasswordCreation';

export interface AccountInfo {
  address: string;
  genesis?: string;
  suri: string;
}

const Page = () => {

  //  const history = useHistory();
  const [_name, setName] = useState<string | null>(null);
  const [step1, setStep1] = useState(true);
  const [account, setAccount] = useState<AccountInfo | null>(null);

  const _onNextStep = useCallback(() => { setStep1(false); }, []);
  const _onBackClick = useCallback(() => { setStep1(true); }, []);
  console.log(account, _name);

  return <div className={styles.page}>
    <div className={styles.pagecont}>
      <HeaderWithSteps
        backOverride={step1 ? undefined : _onBackClick}
        step={step1 ? 1 : 2}
        text={('Import account')}
      />
      {step1
        ? <div>
          <div className={styles.earthInputCont}>
            <div className={styles.labelText}>Enter your Mnemonic Seed phrase</div>
            <SeedAndPath
              onAccountChange={setAccount}
              onNextStep={_onNextStep}
            />
          </div>
        </div>
        : <AccountNamePasswordCreation
          buttonLabel={('Add account')}
          isBusy={false}
          onBackClick={_onBackClick}
          onCreate={console.log}
          onNameChange={setName}
        />

      }
    </div>
  </div>;
};

export default Page;
