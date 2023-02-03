import React, { useCallback, useState } from 'react';
import ActionButton from '~components/composed/ActionButton';
import NavButton from '~components/composed/NavButton';
import {
  useConnectWalletToDApp,
  useCurrentDapp,
  useUpdateActiveAccount,
} from '~hooks/useController';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { selectAccountsByNetwork } from '~state/wallet';
import { isUndefined } from 'lodash';
import { getSymbol } from '~utils/common';
import useToast from '~hooks/useToast';
import clsx from 'clsx';
import { AppState } from '~state/store';

enum ConnectStep {
  Accounts,
  Confirm,
}

export default function ConnectDappPage() {
  const dapp = useCurrentDapp();
  const connectWalletToDapp = useConnectWalletToDApp();
  const { activeNetwork } = useSelector((state: AppState) => state.wallet);
  const accounts = useSelector(selectAccountsByNetwork(activeNetwork.symbol));
  const setDappConnectedAddress = async (address: string, origin: string) => {
    const useUpdateActiveAccounted = useUpdateActiveAccount(address, origin);
    useUpdateActiveAccounted().then(() => {
    });
  };
  const { show } = useToast();

  const [step, setStep] = useState(ConnectStep.Accounts);
  const [accountIndex, setAccountIndex] = useState<number>();

  const onNext = useCallback((): void => show('Select An Account'), [show]);

  const handleSubmit = () => {
    if (step === ConnectStep.Accounts && accountIndex) {
      setStep(ConnectStep.Confirm);
      return;
    }
    connectWalletToDapp().then(() => {
      if (accountIndex === undefined || accountIndex < 0) return;
      setDappConnectedAddress(accounts[accountIndex].address, dapp.origin);
    });
    window.close();
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.header}>
          {step === ConnectStep.Accounts ? (
            <label>Select Account</label>
          ) : (
            <>
              <NavButton onClick={() => setStep(ConnectStep.Accounts)}>
                <ChevronLeftIcon />
                Back
              </NavButton>
              <NavButton>Internet Computer</NavButton>
            </>
          )}
        </section>
        <section className={styles.content}>
          {step === ConnectStep.Accounts ? (
            <>
              <div className={styles.dapp}>
                <span>You are connecting to:</span>
                <i>
                  {dapp.logo && <img src={dapp.logo} />}
                  {dapp.origin}
                </i>
              </div>
              {accounts?.length > 0 ? (
                <div className={styles.connectWith}>
                  <label>Connect With:</label>
                  {accounts
                    ?.sort((a, b) => a.symbol.localeCompare(b.symbol))
                    .map((account, index) => (
                      <div
                        className={styles.row}
                        key={account.id}
                        onClick={() => {
                          setAccountIndex(index);
                          setStep(ConnectStep.Confirm);
                        }}
                      >
                        <span>
                          <img src={getSymbol(account.symbol)?.icon} />
                          <label>
                            {account.meta.name}
                            <small>{account.id}</small>
                          </label>
                        </span>
                        <ChevronRightIcon />
                      </div>
                    ))}
                </div>
              ) : (
                <div className={clsx(styles.connectWith, styles.centerCont)}>
                  Looks like no account exist!
                  <span>
                    Please `Create an Account` or `import seed phrase`
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.url}>
                <span>
                  <i>
                    <img src={dapp.logo} />
                  </i>
                  {dapp.title}
                </span>
              </div>
              <label>Allow This Connection?</label>
              <span>
                This will grant the website access to view the public key you
                selected here:
              </span>
              <div className={styles.accounts}>
                <NavButton>
                  {!isUndefined(accountIndex) &&
                    accounts[accountIndex].meta.name}
                </NavButton>
                {!isUndefined(accountIndex) && accounts[accountIndex].id}
              </div>
            </>
          )}
        </section>
        <section className={styles.footer}>
          {step === ConnectStep.Confirm && (
            <div className={styles.info}>
              Only connect with sites you trust.
            </div>
          )}
          <div className={styles.actions}>
            <ActionButton actionType="secondary" onClick={() => window.close()}>
              Cancel
            </ActionButton>
            <ActionButton
              onClick={() =>
                step === ConnectStep.Accounts ? onNext() : handleSubmit()
              }
            >
              {step === ConnectStep.Accounts ? 'Next' : 'Connect'}
            </ActionButton>
          </div>
        </section>
      </div>
    </div>
  );
}
