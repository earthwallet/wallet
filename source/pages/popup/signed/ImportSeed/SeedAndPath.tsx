// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0



import React, { useState } from 'react';
import styles from './index.scss';

import NextStepButton from '~components/NextStepButton';
import TextAreaWithLabel from '~components/TextAreaWithLabel';
import Warning from '~components/Warning';

interface AccountInfo {
    address: string;
    genesis?: string;
    suri: string;
}
interface Props {
    className?: string;
    onNextStep: () => void;
    onAccountChange: (account: AccountInfo | null) => void;
}


function SeedAndPath({ onNextStep }: Props): React.ReactElement {
    const address = '';
    const [seed, setSeed] = useState<string | null>(null);
    const error = '';
    //const genesis = 'the_icp';


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
                            Please write down your wallet’s mnemonic seed and keep it in a safe place.
                        </div>
                    </div>
                </div>

                {!!error && !seed && (
                    <Warning
                        className={styles.seedError}
                        isBelowInput
                        isDanger
                    >
                        {('Mnemonic needs to contain 12, 15, 18, 21, 24 words')}
                    </Warning>
                )}
                {/*   <Dropdown
          className='genesisSelection'
          label={('Network')}
          onChange={setGenesis}
          options={genesisOptions}
          value={genesis}
        /> */}
                {!!error && !!seed && (
                    <Warning
                        isDanger
                    >
                        {error}
                    </Warning>
                )}
            </>
            <div className={styles.nextCont}>
                <NextStepButton
                    disabled={!address || !!error}
                    onClick={onNextStep}
                >
                    {('Next')}
                </NextStepButton>
            </div>

        </div>
    );
}

export default SeedAndPath;
