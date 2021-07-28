/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */

import React, { useState } from 'react';
import styles from './index.scss';
//import { saveAs } from 'file-saver';
//import { useHistory } from 'react-router-dom';
//import BG_MNEMONIC from '~assets/images/bg_mnemonic.png';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_COPY from '~assets/images/icon_copy.svg';
import CopyToClipboard from 'react-copy-to-clipboard';
//import Loading from '~components/Loading';
import NextStepButton from '~components/NextStepButton';
import HeaderWithSteps from '~components/HeaderWithSteps';
import Password from '~components/Password';


const Page = () => {
  const [isBusy, setIsBusy] = useState(false);
  const [checked, setChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
 //const { setSelectedAccount } = useContext(SelectedAccountContext);

  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  //const type = 'DEFAULT_TYPE';
  const [name, setName] = useState('');
  //const [password, setPassword] = useState<string | null>(null);
  console.log(setStep, setAccount, setIsBusy);
  //const history = useHistory();

  //const genesis = "ICP";

  //const show = console.log;
  const _onCopy = () => console.log();

  

 //const _onCreate = () => console.log();;

  const backupKeystore = () => console.log();

  //const _onNextStep= () => console.log();
  const _onPreviousStep = () => console.log();

  return <div
  className={styles.page}
>
  <HeaderWithSteps backOverride={step === 1 ? undefined : _onPreviousStep}
    step={step}
    text={('Create an account')}
  />{name}{isBusy}
 
    {account &&
      (step === 1
        ? (
          <div>
            <div className='earthInputCont'>
              <div className='labelText'>Account name</div>
              <input
                autoCapitalize='off'
                autoCorrect='off'
                autoFocus={true}
                className='earthName earthInput'
                onChange={(e) => setName(e.target.value)}
                placeholder="REQUIRED"
                required
              />
            </div>
            <div className='earthInputCont mnemonicInputCont'>
              <div className='labelText'>Mnemonic Seed</div>
              <div className='mnemonicContWrap'>
                <div className='mnemonicCont'>
                  { account.seed.split(' ').map((word, index) => <div className='mnemonicWords'
                    key={index}>
                    {word}
                  </div>)}
                  <div className='mnemonicActionsCont'>
                    <CopyToClipboard
                      text={account.seed || ''}
                    >
                      <div
                        className='mnemonicAction'
                        onClick={_onCopy}><img className='mnemonicActionIcon'
                          src={ICON_COPY}/>
                        <div>COPY</div>
                      </div>
                    </CopyToClipboard>

                    <div className='mnemonicAction'
                      onClick={() => backupKeystore()}>
                      <img className='mnemonicActionIcon'
                        src={ICON_COPY}/>
                      <div>DOWNLOAD</div>
                    </div>
                  </div>
                </div>
                <div className='mnemonicHelp'>
                  <div className='mnemonicHelpTitle'>
                This is a generated 12-word mnemonic seed.
                  </div>
                </div>
              </div>
              <div className='checkboxCont'>
                { checked
                  ? <img
                    className='checkboxIcon'
                    onClick={() => setChecked(false)}
                    src={ICON_CHECKED} />
                  : <img
                    className='checkboxIcon'
                    onClick={() => setChecked(true)}
                    src={ICON_UNCHECKED} />
                }

                <div className='checkboxTitle'>I have saved my mnemonic seed safely.</div>
              </div>
              <div>
              </div>
              <NextStepButton
              >
                {('Next step')}
              </NextStepButton>
            </div>
          </div>
        )
        : (
          <>
            <div className='earthInputCont earthInputContPassword'>
              <Password some/>
              <div className={'nextCont'}>
                <div className='checkboxCont'>
                  { secondChecked
                    ? <img
                      className='checkboxIcon'
                      onClick={() => setSecondChecked(false)}
                      src={ICON_CHECKED} />
                    : <img
                      className='checkboxIcon'
                      onClick={() => setSecondChecked(true)}
                      src={ICON_UNCHECKED} />
                  }

                  <div className='checkboxTitle'>I understand that I will lose access to the account if I lose this mnemonic phrase.</div>
                </div>
                <NextStepButton
                >
                  {'Create an Account'}
                </NextStepButton>
              </div>
            </div>
          </>
        ))}
</div>;
};

export default Page;
