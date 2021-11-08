import React, { useState, useCallback } from 'react';
import styles from './index.module.scss';
import { useCurrentDappAddress, useSignApprove } from '~hooks/useController';
import ActionButton from '~components/composed/ActionButton';
import { useController } from '~hooks/useController';
import { decryptString } from '~utils/vault';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';
import { isJsonString } from '~utils/common';
import { validateMnemonic } from '@earthwallet/keyring';
import InputWithLabel from '~components/InputWithLabel';
import Warning from '~components/Warning';
import { stringifyWithBigInt } from '~global/helpers';
import { ClipLoader } from 'react-spinners';
//import { keyable } from '~scripts/Background/types/IMainController';
import { selectRequestStatusById } from '~state/dapp';

const MIN_LENGTH = 6;

const SignTransactionPage = () => {
  const requestId = window.location.hash?.substring(1);
  const requestStatus = useSelector(selectRequestStatusById(requestId));
  const activeAccountAddress = useCurrentDappAddress();

  const controller = useController();
  const request = controller.dapp.getSignatureRequest();
  const selectedAccount = useSelector(selectAccountById(activeAccountAddress));
  const approveSign = useSignApprove();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [pass, setPass] = useState('');
  const response = null;
  const responseArr = [{}, {}];

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



  const handleCancel = () => {
    window.close();
  };


  const handleSign = async () => {
    setIsBusy(true);

    let secret = '';

    try {
      secret = decryptString(selectedAccount?.vault.encryptedJson, pass);
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    if (isJsonString(secret)) {
      console.log('handleSign')
      controller.dapp.setApprovedIdentityJSON(secret);
      await approveSign();
    }
    setIsBusy(false);
  };

  return <div className={styles.page}>
    <div className={styles.title}>Signature Request</div>
    {Array.isArray(request) ? request.map((singleReq, index) => <div key={index} className={styles.requestBody}>
      <div className={styles.label}>
        CanisterId
      </div>
      <div className={styles.value}>
        {singleReq?.canisterId}
      </div>
      <div className={styles.label}>
        Method
      </div>
      <div className={styles.value}>
        {singleReq?.method}
      </div>
      <div className={styles.label}>
        Message
      </div>
      <div className={styles.value}>
        {stringifyWithBigInt(singleReq?.args)}
      </div>
      {false && responseArr && responseArr[index] !== null &&
        <div>
          <div className={styles.label}>
            Response
          </div>
          <div className={styles.value}>
            {stringifyWithBigInt(responseArr[index])}
          </div>
        </div>
      }
    </div>) : <div className={styles.requestBody}>
      <div className={styles.label}>
        CanisterId
      </div>
      <div className={styles.value}>
        {request?.canisterId}
      </div>
      <div className={styles.label}>
        Method
      </div>
      <div className={styles.value}>
        {request?.method}
      </div>
      <div className={styles.label}>
        Message
      </div>
      <div className={styles.value}>
        {stringifyWithBigInt(request?.args)}
      </div>
      {false && response !== null &&
        <div>
          <div className={styles.label}>
            Response
          </div>
          <div className={styles.value}>
          </div>
        </div>
      }
    </div>}

    {requestStatus?.loading ? <section className={styles.footerSuccess}>
      <ClipLoader color={'#fffff'}
        size={15} />
    </section>
      : requestStatus?.complete ?
        <section className={styles.footerSuccess}>
          <ActionButton
            onClick={() => window.close()}>
            Transaction Complete!
          </ActionButton>
        </section> :
        <section className={styles.footer}>
          <InputWithLabel
            data-export-password
            disabled={isBusy}
            isError={pass.length < MIN_LENGTH
              || !!error}
            label={'password for this account'}
            onChange={onPassChange}
            placeholder='REQUIRED'
            type='password'
          />
          {false && error && (
            <Warning
              isBelowInput
              isDanger
            >
              {error}
            </Warning>
          )}
          <div className={styles.actions}>
            <ActionButton actionType="secondary" onClick={handleCancel}>
              Cancel
            </ActionButton>
            <ActionButton
              disabled={error != 'NO_ERROR'}
              onClick={handleSign}>
              Approve
            </ActionButton>
          </div>
        </section>}

  </div>;
};

export default SignTransactionPage;
