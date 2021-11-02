import React, { useState, useCallback } from 'react';
import styles from './index.module.scss';
import { useSignApprove } from '~hooks/useController';
import ActionButton from '~components/composed/ActionButton';
import { useController } from '~hooks/useController';
import { decryptString } from '~utils/vault';
import { selectAccountById, selectDappActiveAccountAddress } from '~state/wallet';
import { useSelector } from 'react-redux';
import { isJsonString } from '~utils/common';
import { validateMnemonic } from '@earthwallet/keyring';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { canisterAgentApi } from '@earthwallet/assets';
import InputWithLabel from '~components/InputWithLabel';
import Warning from '~components/Warning';
import { stringifyWithBigInt } from '~global/helpers';

const MIN_LENGTH = 6;

const SignTransactionPage = () => {
  const controller = useController();
  const request = controller.dapp.getSignatureRequest();
  const activeAccountAddress = useSelector(selectDappActiveAccountAddress);
  const selectedAccount = useSelector(selectAccountById(activeAccountAddress));
  //wallet.activeAccount.address
  const approveSign = useSignApprove();
  const [isBusy, setIsBusy] = useState(false);
  const [txError, setTxError] = useState('');
  const [error, setError] = useState('');
  const [pass, setPass] = useState('');
  const [success, setSuccess] = useState(false);

  console.log(txError, approveSign);
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

  const signCanister = async () => {
    setIsBusy(true);
    setTxError('');

    let secret = '';

    try {
      secret = decryptString(selectedAccount?.vault.encryptedJson, pass);
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    if (isJsonString(secret)) {
      const fromIdentity = Secp256k1KeyIdentity.fromJSON(secret);
      let response: any;
      let counter = 0;
      console.log(request, Array.isArray(request))

      if (Array.isArray(request)) {
        response = [];
        for (const singleReqest of request) {
          response[counter] = await canisterAgentApi(
            singleReqest?.canisterId,
            singleReqest?.method,
            singleReqest?.args,
            fromIdentity
          );
          counter++;
        }
      }
      else {
        response = await canisterAgentApi(
          request?.canisterId,
          request?.method,
          request?.args,
          fromIdentity
        );
      }

      console.log(response);

      /*     await approveSign().then(() => {
           });
          window.close(); */

      if (!Array.isArray(response) && response.type !== 'error') {
        setSuccess(true);
      }
      else {
        //todo
      }
      return response;
    }
    return true;
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
    </div>}

    {success ?
      <section className={styles.footerSuccess}>
        <ActionButton
          onClick={() => window.close()}>
          Success! 🎊
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
          <ActionButton actionType="secondary" onClick={() => window.close()}>
            Cancel
          </ActionButton>
          <ActionButton
            disabled={error != 'NO_ERROR'}
            onClick={signCanister}>
            Approve
          </ActionButton>
        </div>
      </section>}

  </div>;
};

export default SignTransactionPage;
