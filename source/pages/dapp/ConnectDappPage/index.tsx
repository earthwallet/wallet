import React from 'react';
import ActionButton from '~components/composed/ActionButton';
import NavButton from '~components/composed/NavButton';

import styles from './index.module.scss';

export default function ConnectDappPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.header}>
          <NavButton>Internet Computer</NavButton>
        </section>
        <section className={styles.content}>
          <div className={styles.url}>
            <span>
              <img src="#" />
              pancakeswap.finance
            </span>
          </div>
          <label>Allow This Connection?</label>
          <span>
            This will grant the website access to view the public key you
            selected here:
          </span>
          <div className={styles.accounts}>
            <NavButton>0xO2EF...dD45</NavButton>
          </div>
        </section>
        <section className={styles.footer}>
          <div className={styles.info}>Only connect with sites you trust.</div>
          <div className={styles.actions}>
            <ActionButton actionType="secondary">Cancel</ActionButton>
            <ActionButton>Connect</ActionButton>
          </div>
        </section>
      </div>
    </div>
  );
}
