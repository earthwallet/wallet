import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './index.scss';
import InputWithLabel from '~components/InputWithLabel';
import NextStepButton from '~components/NextStepButton';
import Warning from '~components/Warning';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import clsx from 'clsx';
import { RouteComponentProps, withRouter } from 'react-router';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';
import { send } from '@earthwallet/keyring';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { isJsonString } from '~utils/common';
import { principal_to_address } from '@earthwallet/keyring/build/main/util/icp';
import { getSymbol } from '~utils/common';

import { decryptString } from '~utils/vault';
import { validateMnemonic, transfer, getFees } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceByAddress } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';
import { DEFAULT_ICP_FEES } from '~global/constant';
import indexToHash from './indexToHash'
import { useHistory } from 'react-router-dom';
import { selectAssetsICPByAddress } from '~state/wallet';
import ICON_CARET from '~assets/images/icon_caret.svg';
import useQuery from '~hooks/useQuery';
import { listNFTsExt, principalTextoAddress, transferNFTsExt } from '@earthwallet/assets';
import { getShortAddress } from '~utils/common';
import { getTokenImageURL } from '~global/nfts';
import { validateAddress } from '@earthwallet/assets';

const MIN_LENGTH = 6;
const PRINCIPAL_NOT_ACCEPTED = 'Principal id is not accepted!';
interface keyable {
  [key: string]: any
}

interface Props extends RouteComponentProps<{ address: string }> {
}

const WalletSendTokens = ({
  match: {
    params: { address },
  },
}: Props) => {

  const [step1, setStep1] = useState(true);
  const selectedAccount = useSelector(selectAccountById(address));
  const controller = useController();
  const currentBalance: keyable = useSelector(selectBalanceByAddress(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));

  const assets: keyable = useSelector(selectAssetsICPByAddress(address));


  const dropDownRef = useRef(null);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [pass, setPass] = useState('');
  const [recpError, setRecpError] = useState('');

  const [error, setError] = useState('');
  const [txError, setTxError] = useState('');
  const [fees, setFees] = useState<number>(0);

  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [selectCredit, setSelectCredit] = useState<boolean>(true);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedAssetObj, setSelectedAssetObj] = useState<keyable>({});

  const [toggleAssetDropdown, setToggleAssetDropdown] = useState<boolean>(false);
  const queryParams = useQuery();



  const toggle = React.useCallback(() => {
    setToggleAssetDropdown((v) => !v);
  }, []);

  const toggleAndSetAsset = React.useCallback((asset: string) => {
    toggle();
    setSelectedAsset(asset);
    setSelectedAssetObj(getSelectedAsset(asset));
  }, []);


  const [isBusy, setIsBusy] = useState(false);
  const [txCompleteTxt, setTxCompleteTxt] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    if (queryParams.get('assetid') === null) {
      setSelectedAsset(selectedAccount?.symbol)
    }
    else {
      setSelectedAsset(queryParams.get('assetid') || '');
      setSelectedAssetObj(getSelectedAsset(queryParams.get('assetid') || ''))
    }
  }, [queryParams.get('assetid') !== null]);

  useEffect(() => {
    controller.accounts
      .getBalancesOfAccount(selectedAccount)
      .then(() => {
      });

    if (selectedAccount?.symbol !== 'ICP') {
      getFees(selectedAccount?.symbol).then(fees => {
        const BTC_DECIMAL = 8;
        setFees(fees.fast.amount().shiftedBy(-1 * BTC_DECIMAL).toNumber());
      })
    }
    else {
      setFees(DEFAULT_ICP_FEES);
    }
  }, [selectedAccount?.id === address]);


  const loadMaxAmount = useCallback((): void => {
    if (parseFloat(currentBalance?.value) === 0) {
      setError(`Not enough balance. Transaction fees is ${fees} ${selectedAccount?.symbol}`);
    }
    else {
      let maxAmount = currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
      setSelectedAmount(parseFloat(maxAmount.toFixed(8)));
    }
  }, [currentBalance, fees]);

  const onConfirm = useCallback(() => {
    if (selectedAsset !== selectedAccount?.symbol) {
      setError('');
      setStep1(false);
    }
    else {
      let maxAmount = currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
      if (selectedAmount !== 0 && selectedAmount <= maxAmount) {
        setError('');
        setStep1(false);
      }
      else if (selectedAmount === 0) {
        setError(`Amount cannot be zero. Transaction fees is ${fees} ${selectedAccount?.symbol}`);
        setStep1(true);
      }
      else {
        setError(`Please check entered amount. Transaction fees is ${fees} ${selectedAccount?.symbol}`);
        setStep1(true);
      }
    }

  }, [fees, selectedAmount, currentBalance, selectedAccount, selectedAsset]);

  const onBackClick = useCallback(() => { setStep1(true); }, []);
  const transferForAll = async () => {
    setIsBusy(true);
    setTxError('');
    let mnemonic = '';
    try {
      mnemonic = decryptString(selectedAccount?.vault.encryptedMnemonic, pass);
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }
    try {
      if (selectedAmount === 0) {
        alert('Amount cannot be 0');
      }
      const hash: any = await transfer(
        selectedRecp,
        selectedAmount.toString(),
        mnemonic,
        selectedAccount?.symbol,
        { network: 'mainnet' }
      );

      await controller.accounts
        .getBalancesOfAccount(selectedAccount)
        .then(() => {
        });
      setLoadingSend(false);
      setTxCompleteTxt('Payment Done! Check transactions for more details.' || hash || '');
      setIsBusy(false);
    } catch (error) {
      console.log(error);
      setTxError('Unable to send! Please try again later');
      setLoadingSend(false);
      setIsBusy(false);
    }

  }

  const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.tokenIdentifier === assetId)[0]

  const transferAssetsForICP = async () => {
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
      const currentIdentity = Secp256k1KeyIdentity.fromJSON(secret);
      const address = principal_to_address(currentIdentity.getPrincipal());

      setLoadingSend(true);
      if (selectedAsset === selectedAccount?.symbol) {
        try {
          if (selectedAmount === 0) {
            alert('Amount cannot be 0');
          }
          const index: BigInt = await send(
            currentIdentity,
            selectedRecp,
            address,
            selectedAmount,
            'ICP'
          );

          const hash: string = await indexToHash(index);


          await controller.accounts
            .getBalancesOfAccount(selectedAccount)
            .then(() => {
              if (hash !== undefined) {
                history.replace(`/account/transaction/${hash}`)
              }
              else {
                setLoadingSend(false);
                setTxCompleteTxt('Payment Done! Check transactions for more details.');
                setIsBusy(false);
              }
            });

        } catch (error) {
          console.log(error);
          setTxError("Please try again! Error: " + JSON.stringify(error));
          setLoadingSend(false);
          setIsBusy(false);
        }
      } else {
        try {
          if (selectedAssetObj?.forSale === true) {
            await listNFTsExt(selectedAssetObj?.canisterId, currentIdentity, selectedAssetObj?.tokenIndex, 0, true);
            await transferNFTsExt(selectedAssetObj?.canisterId, currentIdentity, selectedRecp, selectedAssetObj?.tokenIndex);
          }
          else {
            await transferNFTsExt(selectedAssetObj?.canisterId, currentIdentity, selectedRecp, selectedAssetObj?.tokenIndex);
          }

          setTxCompleteTxt('Successfully transferred NFT to ' + getShortAddress(selectedRecp, 3));
          setLoadingSend(false);
          setIsBusy(false);
          //update asset balances after tx
          controller.assets.updateTokenDetails({ id: selectedAsset, address: selectedRecp });
          controller.assets.getICPAssetsOfAccount({ address, symbol: 'ICP' });
          controller.assets.getICPAssetsOfAccount({ address: selectedRecp, symbol: 'ICP' });

        } catch (error) {
          console.log(error);
          setTxError("Please try again! Error: " + JSON.stringify(error));
          setLoadingSend(false);
          setIsBusy(false);
        }

      }
    } else {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    return true;
  };

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
    }
    , [selectedAccount]);

  const parseRecipientAndSetAddress = (recipient: string) => {
    if (selectedAccount?.symbol === 'ICP') {
      setSelectedRecp(recipient);
      if (validateAddress(recipient)) {
        setRecpError('');
      }
      else {
        const dashCount = (recipient.match(/-/g) || []).length;
        if (dashCount === 5 || dashCount === 10) {
          setRecpError(PRINCIPAL_NOT_ACCEPTED)
        }
        else {
          setRecpError('Not a valid address');
        }
      }
    }
    else {
      setSelectedRecp(recipient);
    }
  };

  const togglePrincipal = () => {
    setSelectedRecp(recipient => principalTextoAddress(recipient));
    setRecpError('');
  }

  return <div className={styles.page}><>
    <Header
      backOverride={step1 ? undefined : txCompleteTxt === '' ? onBackClick : undefined}
      centerText
      showMenu
      text={'Send'}
      type={'wallet'} />
    <div className={styles.pagecont}
      ref={dropDownRef}
    >
      {!(txCompleteTxt === undefined || txCompleteTxt === '') && <div
        className={styles.paymentDone}>
        {txCompleteTxt}
      </div>}
      {step1
        ? <div style={{ width: '100vw' }}>
          <div className={styles.earthInputLabel}>Add recipient</div>
          <input
            autoCapitalize='off'
            autoCorrect='off'
            autoFocus={true}
            className={clsx(styles.earthinput, styles.recipientAddress)}
            key={'recp'}
            onChange={(e) => parseRecipientAndSetAddress(e.target.value)}
            placeholder="Recipient address"
            required
            value={selectedRecp}
          />
          {recpError !== '' && <Warning
            isBelowInput
            isDanger
            className={styles.warningRecp}
          >
            {recpError} {recpError === PRINCIPAL_NOT_ACCEPTED && <div
              onClick={() => togglePrincipal()}
              className={styles.earthLink}>Click here to change principal id to address</div>}
          </Warning>}
          <div className={styles.assetSelectionDivCont}>
            <div className={styles.earthInputLabel}>
              Asset
            </div>
            <div className={styles.tokenSelectionDiv}>
              {selectedAsset === selectedAccount?.symbol && <SelectedAsset
                onSelectedAssetClick={toggle}
                label={selectedAccount?.symbol}
                logo={getSymbol(selectedAccount?.symbol)?.icon || ''}
                loading={currentBalance?.loading}
                showDropdown={assets?.length === 0 || assets?.length === undefined}
                balanceText={currentBalance === null
                  ? `Balance: `
                  : `Balance: ${currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)} ${currentBalance?.currency?.symbol}`
                }
              />}
              {getSelectedAsset(selectedAsset) && <SelectedAsset
                onSelectedAssetClick={toggle}
                label={selectedAssetObj?.tokenIndex}
                loading={false}
                balanceText={'1 NFT'}
                logo={getTokenImageURL(selectedAssetObj)}
              />
              }
              {toggleAssetDropdown &&
                <div className={styles.assetOptions}>
                  <AssetOption
                    onAssetOptionClick={() => toggleAndSetAsset(selectedAccount?.symbol || '')}
                    label={selectedAccount?.symbol}
                    logo={getSymbol(selectedAccount?.symbol)?.icon || ''}
                    balanceText={currentBalance === null
                      ? `Balance: `
                      : `Balance: ${currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)} ${currentBalance?.currency?.symbol}`
                    }
                  />
                  {assets?.map((asset: keyable, index: number) => <AssetOption
                    key={index}
                    onAssetOptionClick={() => toggleAndSetAsset(asset?.tokenIdentifier || index)}
                    label={asset?.tokenIndex}
                    logo={getTokenImageURL(asset)}
                    balanceText={'1 NFT'}
                  />
                  )}
                </div>
              }
            </div>
          </div>
          {selectedAsset === selectedAccount?.symbol && <div>
            <div
              className={styles.earthInputLabel}>
              Amount  {selectedAccount?.symbol !== 'BTC' && <div
                onClick={() => loadMaxAmount()}
                className={styles.maxBtn}>Max</div>}
            </div>
            <input
              autoCapitalize='off'
              autoCorrect='off'
              autoFocus={false}
              className={clsx(styles.recipientAddress, styles.earthinput)}
              key={'amount'}
              max="1.00"
              min="0.00"
              onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
              placeholder="amount up to 8 decimal places"
              required
              step="0.001"
              type="number"
              value={selectedAmount}
            />
            {error && (
              <div
                className={styles.noBalanceError}
              >
                <Warning
                  isBelowInput
                  isDanger
                >
                  {error}
                </Warning>
              </div>
            )}
          </div>}
        </div>
        : <div className={styles.confirmPage}>
          {selectedAsset === selectedAccount?.symbol ? <div className={styles.confirmAmountCont}>
            <img
              className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
              src={getSymbol(selectedAccount?.symbol)?.icon}

            />
            <div>
              <div className={styles.tokenText}>{getSymbol(selectedAccount?.symbol)?.name}</div>
              <div className={styles.tokenAmount}>{selectedAmount} {selectedAccount?.symbol}</div>
              <div className={styles.tokenValue}>${(selectedAmount * currentUSDValue?.usd).toFixed(3)}</div>
            </div>

          </div>
            : <div className={styles.confirmAmountCont}>
              <img
                className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
                src={getTokenImageURL(selectedAssetObj)}
              />
              <div>
                <div className={styles.tokenText}>{selectedAssetObj?.tokenIndex}</div>
                <div className={styles.tokenAmount}>1 NFT</div>
              </div>

            </div>
          }
          {selectedAsset === selectedAccount?.symbol && <div className={styles.feeCont}>
            <div className={styles.feeRow}>
              <div className={styles.feeTitle}>Transaction Fee</div>
              <div>
                <div className={styles.feeAmount}>{fees} {selectedAccount?.symbol}</div>
                <div className={styles.feeValue}>${(fees * currentUSDValue?.usd).toFixed(3)}</div>
              </div>
            </div>
            {false && selectCredit && <div className={styles.feeRow}>
              <div className={styles.feeTitle}>Earth Credit<span
                onClick={() => setSelectCredit(false)}
                className={styles.removeBtn}>Remove</span></div>
              <div>
                <div className={styles.feeAmount}>You Recieve</div>
                <div className={styles.feeValue}>1.50 EARTH</div>
              </div>
            </div>}
            <div className={styles.feeRow}>
              <div className={styles.feeTotal}>Total</div>
              <div>
                <div className={styles.feeAmount}>{(selectedAmount + fees).toFixed(currentBalance?.currency?.decimals)}</div>
                <div className={styles.feeValue}>${((selectedAmount + fees) * currentUSDValue?.usd).toFixed(3)}</div>
              </div>
            </div>

          </div>}
          <InputWithLabel
            data-export-password
            disabled={isBusy}
            isError={pass.length < MIN_LENGTH || !!error}
            label={'password for this account'}
            onChange={onPassChange}
            placeholder='REQUIRED'
            type='password'
          />
          {error && (
            <Warning
              isBelowInput
              isDanger
            >
              {error}
            </Warning>
          )}
        </div>}

      {txError && (
        <div
          className={styles.noBalanceError}
        ><Warning
          isBelowInput
          isDanger
        >
            {txError}
          </Warning></div>
      )}
    </div>
    <div style={{
      margin: '0 30px 30px 30px',
      position: 'absolute',
      bottom: 0,
      left: 0
    }}>
      {step1
        ? <NextStepButton
          disabled={loadingSend || !selectedRecp || recpError !== ''}
          loading={isBusy}
          onClick={onConfirm}>
          {'Next'}
        </NextStepButton>

        : <NextStepButton
          disabled={loadingSend || !!error || pass.length < MIN_LENGTH || !(txCompleteTxt === undefined || txCompleteTxt === '')}
          loading={isBusy || loadingSend}
          onClick={() => selectedAccount?.symbol === 'ICP' ? transferAssetsForICP() : transferForAll()}>
          {'Send'}
        </NextStepButton>}
    </div>
  </></div>;
};


interface SelectedAssetProps {
  logo: string,
  label: string,
  loading: boolean,
  balanceText: string,
  showDropdown?: boolean,
  onSelectedAssetClick: () => void
}

interface AssetOptionProps {
  logo: string,
  label: string,
  balanceText: string,
  onAssetOptionClick: () => void
}

const SelectedAsset = ({ logo, label, loading, balanceText, onSelectedAssetClick, showDropdown }: SelectedAssetProps) => <div
  onClick={showDropdown ? console.log : onSelectedAssetClick}
  className={clsx(styles.selectedNetworkDiv, showDropdown && styles.selectedNetworkDiv_noPointer)}>
  <img
    className={styles.tokenLogo}
    src={logo}
  />
  <div className={styles.tokenSelectionLabelDiv}>
    <div className={styles.tokenLabel}>{label}</div>
    <div className={styles.tokenBalance}>
      {loading
        ? <SkeletonTheme color="#222"
          highlightColor="#000">
          <Skeleton width={150} />
        </SkeletonTheme>
        : <span className={styles.tokenBalanceText}>{balanceText}</span>
      }
    </div>
  </div>
  {!showDropdown && <img className={styles.iconcaret} src={ICON_CARET} />}
</div>

const AssetOption = ({ logo, label, balanceText, onAssetOptionClick }: AssetOptionProps) => <div
  onClick={onAssetOptionClick}
  className={clsx(styles.selectedNetworkDiv, styles.selectedNetworkDivOption)}>
  <img
    className={styles.tokenLogo}
    src={logo}
  />
  <div className={styles.tokenSelectionLabelDiv}>
    <div className={styles.tokenLabel}>{label}</div>
    <div className={styles.tokenBalance}>
      <span className={styles.tokenBalanceText}>{balanceText}</span>
    </div>
  </div>
</div>
export default withRouter(WalletSendTokens);