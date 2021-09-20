import React, { useState, useEffect } from 'react';
import styles from './index.scss';

import NextStepButton from '~components/NextStepButton';
import TextAreaWithLabel from '~components/TextAreaWithLabel';
import Warning from '~components/Warning';
import { validateMnemonic } from '@earthwallet/keyring';

interface Props {
  className?: string;
  onNextStep: () => void;
  onSeedChange: (seed: string | null) => void;
}

function SeedAndPath({ onNextStep, onSeedChange }: Props): React.ReactElement {
  const [seed, setSeed] = useState<string | null>(null);
  const [isValidSeed, setIsValidSeed] = useState<boolean>(false);

  const error = '';

  useEffect(() => {
    // No need to validate an empty seed
    // we have a dedicated error for this
    if (!seed) {
      onSeedChange(null);
      setIsValidSeed(false);
      return;
    }
    if (validateMnemonic(seed)) {
      setIsValidSeed(true);
    }
    else {
      setIsValidSeed(false);
    }
    onSeedChange(seed);
  }, [seed, onSeedChange]);

  return (
    <div>
      <>
        <div className={styles.seedInputCont}>
          <TextAreaWithLabel
            containerClass={styles.seedInput}
            isError={!!error}
            isFocused
            label={''}
            onChange={setSeed}
            placeholder="paste the mnemonic seed phrase here"
            rowsCount={2}
            value={seed || ''}
          />
          <div className={styles.mnemonicHelp}>
            <div className={styles.mnemonicHelpTitle}>
              To restore your account, paste your saved mnemonic phrase here
            </div>
            <div className={styles.mnemonicHelpSubTitle}>
              Please write down your wallet’s mnemonic seed and keep it in a
              safe place.
            </div>
          </div>
        </div>

        {!!error && !seed && (
          <Warning className={styles.seedError} isBelowInput isDanger>
            {'Mnemonic needs to contain 12, 15, 18, 21, 24 words'}
          </Warning>
        )}
        {!!error && !!seed && <Warning isDanger>{error}</Warning>}
      </>
      <div className={styles.nextCont}>
        <NextStepButton disabled={!isValidSeed || !!error} onClick={onNextStep}>
          {'Next'}
        </NextStepButton>
      </div>
    </div>
  );
}

export default SeedAndPath;
