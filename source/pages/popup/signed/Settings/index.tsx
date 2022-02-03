import React, { useState } from 'react';
import styles from './index.scss';

const Settings = () => {
  const [on, setOn] = useState(false);
  const [off, setOff] = useState(true);

  const onHandler = () => {
    setOn(true);
    setOff(false);
  };

  const offHandler = () => {
    setOff(true);
    setOn(false);
  };
  return (
    <div className={styles.page}>
      <div className={styles.transactionSettingsContainer}>
        <span className={styles.slippageText}>Slippage tolerance?</span>
        <div className={styles.autoButtonContainer}>
          <button className={styles.autoButton}>Auto</button>
          <input type="text" placeholder="0.10%" className={styles.inputBox} />
        </div>
        <div className={styles.disableContainer}>
          <span className={styles.disableText}>Disable Multihops?</span>
          <div className={styles.buttonContainer}>
            <button
              className={
                on === false ? styles.inActiveOnButton : styles.activeOnButton
              }
              onClick={() => onHandler()}
            >
              On
            </button>
            <button
              className={
                off === true
                  ? styles.activeOffButton
                  : styles.inActiveOffButton
              }
              onClick={() => offHandler()}
            >
              Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
