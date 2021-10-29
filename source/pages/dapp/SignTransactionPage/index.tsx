import React from 'react';
import styles from './index.module.scss';
import { useSignApprove } from '~hooks/useController';
import ActionButton from '~components/composed/ActionButton';

const SignTransactionPage = () => {

  const approveSign = useSignApprove();

  const handleSubmit = () => {

    approveSign().then(() => {
      /*     encrypt the password and identity */
    });
    window.close();
  };
  return <div className={styles.page}>
    SignTransactionPage

    <section className={styles.footer}>
      <div className={styles.actions}>
        <ActionButton actionType="secondary" onClick={() => window.close()}>
          Cancel
        </ActionButton>
        <ActionButton onClick={handleSubmit}>
          Approve
        </ActionButton>
      </div>
    </section>

  </div>;
};

export default SignTransactionPage;
