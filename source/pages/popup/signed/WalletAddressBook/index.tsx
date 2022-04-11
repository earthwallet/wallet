import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.scss';
import NextStepButton from '~components/NextStepButton';

import { RouteComponentProps, withRouter } from 'react-router';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';

import { selectActiveTokensAndAssetsICPByAddress } from '~state/wallet';
import useQuery from '~hooks/useQuery';
import AddressInput from '~components/AddressInput';
import Header from '~components/Header';

interface keyable {
  [key: string]: any
}

interface Props extends RouteComponentProps<{ address: string }> {
}

const WalletAddressBook = ({
  match: {
    params: { address },
  },
}: Props) => {

  const [step1, setStep1] = useState(true);
  const selectedAccount = useSelector(selectAccountById(address));

  const assets: keyable = useSelector(selectActiveTokensAndAssetsICPByAddress(address));


  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [recpError, setRecpError] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const queryParams = useQuery();



  const tokenId = queryParams.get('tokenId');
  const assetId = queryParams.get('assetId');

  useEffect(() => {
    if (assetId === null && tokenId === null) {
      setSelectedAsset(selectedAccount?.symbol)
    }
    else if (assetId !== null) {
      setSelectedAsset(assetId || '');
    }
    else if (tokenId !== null) {
      setSelectedAsset(tokenId || '');
    }
  }, [assetId !== null, tokenId !== null]);






  const onConfirm = useCallback(() => {
    if (selectedAsset !== selectedAccount?.symbol) {
      setStep1(false);
    }
    else {
      setStep1(false);
    }

  }, [selectedAccount, selectedAsset]);

  const onBackClick = useCallback(() => { setStep1(true); }, []);


  const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.id === assetId)[0]







  return <div className={styles.page}><>
    <Header
      backOverride={step1 ? undefined : onBackClick}
      centerText
      showMenu
      text={'Send'}
      type={'wallet'} />
    <div className={styles.pagecont}
      ref={dropDownRef}
    >

      {step1
        ? <div style={{ width: '100vw' }}>
          <div className={styles.earthInputLabel}>Add recipient</div>
          <AddressInput
            initialValue={selectedRecp}
            recpErrorCallback={setRecpError}
            recpCallback={setSelectedRecp}
            inputType={selectedAccount?.symbol}
            autoFocus={true}
            tokenId={getSelectedAsset(selectedAsset)?.tokenId}
          />
        </div>
        : <div />}

    </div>
    {false && <div style={{
      margin: '0 30px 30px 30px',
      position: 'absolute',
      bottom: 0,
      left: 0
    }}>
      {step1
        ? <NextStepButton
          disabled={!selectedRecp || recpError !== ''}
          loading={false}
          onClick={onConfirm}>
          {'Next'}
        </NextStepButton>

        : <div />}
    </div>}
  </></div>;
};


export default withRouter(WalletAddressBook);
