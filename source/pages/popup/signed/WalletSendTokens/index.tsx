import React, { useCallback, useState, useEffect } from 'react';
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
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { isJsonString } from '~utils/common';
import { principal_to_address } from '@earthwallet/keyring/build/main/util/icp';
import { getSymbol } from '~utils/common';

import { decryptString } from '~utils/vault';
import { validateMnemonic, getFees, createWallet } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceById } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';
import { DEFAULT_ICP_FEES } from '~global/constant';
import indexToHash from './indexToHash'
import { useHistory } from 'react-router-dom';
import { selectActiveTokensAndAssetsByAddress } from '~state/wallet';
import ICON_CARET from '~assets/images/icon_caret.svg';
import useQuery from '~hooks/useQuery';
import { listNFTsExt, transferNFTsExt } from '@earthwallet/assets';
import { getShortAddress } from '~utils/common';
import { getTokenImageURL } from '~global/nfts';
import AddressInput from '~components/AddressInput';
import { getTokenInfo } from '~global/tokens';
import { selectInfoBySymbolOrToken } from '~state/token';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import { getFeesExtended, getFeesExtended_MATIC } from '~utils/services';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { ethers } from 'ethers';
import { OpenSeaPort, Network } from 'opensea-js'
import HDWalletProvider from '@truffle/hdwallet-provider';


const MIN_LENGTH = 6;
const DEFAULT_FEE_INDEX = 1;

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
  const currentBalance: keyable = useSelector(selectBalanceById(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));

  const assets: keyable = useSelector(selectActiveTokensAndAssetsByAddress(address));

  console.log(assets, selectedAccount, 'assets');

  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [pass, setPass] = useState('');
  const [recpError, setRecpError] = useState('');

  const [error, setError] = useState('');
  const [txError, setTxError] = useState('');
  const [fees, setFees] = useState<number>(0);
  const [feesArr, setFeesArr] = useState<keyable[]>([]);
  const [feesOptionSelected, setFeesOptionSelected] = useState<number>(DEFAULT_FEE_INDEX);
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
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
    setSelectedAmount(0);
    if (selectedAccount?.symbol == 'ETH') {
      if (getSelectedAsset(selectedAsset)?.format == 'nft') {
        //ERC721 Transfer estimate is 84904 as per etherscan
        getFeesExtended(selectedAccount?.symbol, 84904).then((_feesArr: keyable[]) => {
          setFeesOptionSelected(feesOptionSelected);
          _feesArr[feesOptionSelected] && setFees(_feesArr[feesOptionSelected]?.gas);
          setFeesArr(_feesArr);
        })
      } else {
        getFeesExtended(selectedAccount?.symbol).then((_feesArr: keyable[]) => {
          setFeesOptionSelected(feesOptionSelected);
          _feesArr[feesOptionSelected] && setFees(_feesArr[feesOptionSelected]?.gas);
          setFeesArr(_feesArr);
        })
      }
    }
  }, []);


  const [isBusy, setIsBusy] = useState(false);
  const [txCompleteTxt, setTxCompleteTxt] = useState<string>('');
  const history = useHistory();
  const tokenId = queryParams.get('tokenId');
  const assetId = queryParams.get('assetId');
  const queryRecipient = queryParams.get('recipient');
  const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.id === assetId)[0]

  useEffect(() => {
    if (queryRecipient !== null) {
      setSelectedRecp(queryRecipient)
    }

  }, [queryRecipient !== null]);

  useEffect(() => {
    if (assetId === null && tokenId === null) {
      setSelectedAsset(selectedAccount?.symbol)
    }
    else if (assetId !== null) {
      setSelectedAsset(assetId || '');
      setSelectedAssetObj(getSelectedAsset(assetId || ''))
    }
    else if (tokenId !== null) {
      setSelectedAsset(tokenId || '');
      setSelectedAssetObj(getSelectedAsset(tokenId || ''))
    }
  }, [assetId !== null, tokenId !== null]);


  useEffect(() => {
    controller.accounts
      .getBalancesOfAccount(selectedAccount)
      .then(() => {
      });
    tokenId !== null && controller.tokens.getTokenBalances(address);

    if (selectedAccount?.symbol === 'BTC') {
      setIsBusy(true);

      getFees(selectedAccount?.symbol).then(fees => {
        setIsBusy(false);
        const BTC_DECIMAL = 8;
        setFees(fees.fast.amount().shiftedBy(-1 * BTC_DECIMAL).toNumber());
      })
    }
    else if (selectedAccount?.symbol === 'ICP') {
      if (tokenId == null) {
        setFees(DEFAULT_ICP_FEES);
      }
      else {
        setFees(getTokenInfo(tokenId)?.sendFees);
      }
    } else if (selectedAccount?.symbol === 'MATIC' || selectedAccount?.symbol === 'ETH') {
      setIsBusy(true);

      if (getSelectedAsset(selectedAsset)?.format == 'nft') {
        console.log('_estimateGasForTransfer');
        getFeesExtended(selectedAccount?.symbol, 84904).then((_feesArr: keyable[]) => {
          setFeesOptionSelected(DEFAULT_FEE_INDEX);
          _feesArr[DEFAULT_FEE_INDEX] && setFees(_feesArr[DEFAULT_FEE_INDEX]?.gas);
          setFeesArr(_feesArr);
        })

      } else {
        getFeesExtended(selectedAccount?.symbol).then((_feesArr: keyable[]) => {
          setFeesOptionSelected(DEFAULT_FEE_INDEX);
          _feesArr[DEFAULT_FEE_INDEX] && setFees(_feesArr[DEFAULT_FEE_INDEX]?.gas);
          setFeesArr(_feesArr);
        })
      }

      setIsBusy(false);
    }
  }, [selectedAccount?.id === address, getSelectedAsset(selectedAsset)?.format == 'nft']);

  const changeFees = useCallback((index: number) => {
    setFeesOptionSelected(index);
    setFees(feesArr[index]?.gas)
  }, [feesArr[0]]);


  const onConfirm = useCallback(() => {
    if (selectedAsset !== selectedAccount?.symbol) {
      setError('');
      setStep1(false);
    }
    else {
      setStep1(false);

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
        getSelectedAsset(selectedAsset)?.format != 'nft' && alert('Amount cannot be 0');
      }
      let hash: any;
      if (selectedAccount?.symbol == 'BTC') {
        hash = await controller.accounts.sendBTC(
          selectedRecp,
          selectedAmount,
          mnemonic,
          address
        );

      } else if (selectedAccount?.symbol == 'ETH') {
        if (selectedAsset === selectedAccount?.symbol) {
          hash = await controller.accounts.sendETH(
            selectedRecp,
            selectedAmount,
            mnemonic,
            feesArr,
            feesOptionSelected
          );
        } else if (getSelectedAsset(selectedAsset)?.format == 'nft') {


          const provider = new HDWalletProvider({
            mnemonic: mnemonic,
            providerOrUrl: 'https://eth-mainnet.alchemyapi.io/v2/WGaCcGcGiHHQrxew6bZZ9r2qMsP8JS80',
            addressIndex: 0
          });

          const seaport = new OpenSeaPort(provider, {
            networkName: Network.Main
          })





          await seaport.transfer({
            fromAddress: selectedAccount.address,
            toAddress: selectedRecp,
            asset: {
              tokenAddress: getSelectedAsset(selectedAsset)?.contractAddress,
              tokenId: getSelectedAsset(selectedAsset)?.tokenIndex,
            }
          });

        }
      } else if (selectedAccount?.symbol == 'MATIC') {
        //alert('do MATIC');

        const wallet_tx = await createWallet(mnemonic, 'MATIC');

        const web3 = createAlchemyWeb3(
          'https://polygon-mainnet.g.alchemy.com/v2/WQY8CJqsPNCqhjPqPfnPApgc_hXpnzGc'
        );

        const privateKey = ethers.Wallet.fromMnemonic(mnemonic).privateKey;

        const nonce = await web3.eth.getTransactionCount(wallet_tx.address, 'latest');

        const transaction = {
          nonce: nonce,
          from: wallet_tx.address,
          to: selectedRecp,
          value: web3.utils.toWei(selectedAmount.toString(), 'ether'),
        };
        // estimate gas usage. This is units. minimum cap being 21000 units
        const estimateGas = await web3.eth.estimateGas(transaction);

        // get gas prices

        //
        // const fee = await web3.eth.getMaxPriorityFeePerGas();
        // console.log('fee', web3.utils.toBN(fee).toString());
        const priorityFees: keyable = await getFeesExtended_MATIC();
        // use 200% gas estimate as gas limit to be safe.
        // sign transaction
        const signedTx: keyable = await web3.eth.accounts.signTransaction(
          {
            gas: estimateGas,
            maxPriorityFeePerGas: web3.utils.toWei(
              priorityFees['fast']['maxPriorityFee'].toFixed(5),
              'gwei'
            ),
            maxFeePerGas: web3.utils.toWei(priorityFees['fast']['maxFee'].toFixed(5), 'gwei'),
            ...transaction,
          },
          privateKey
        );
        //send signed transaction
        const result = await web3.eth.sendSignedTransaction(signedTx?.rawTransaction);
        console.log(result);
      }

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
          const index: BigInt = await controller.accounts.sendICP(
            secret,
            selectedRecp,
            selectedAmount,
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
        if (getSelectedAsset(selectedAsset)?.type == 'DIP20' || getSelectedAsset(selectedAsset)?.type == 'ERC20') {
          const callback = (path: string) => console.log(path);
          controller.tokens.transferToken(secret, selectedAsset, selectedRecp, selectedAmount, address, callback).then(() => {

            setTxCompleteTxt('Successfully transferred to ' + getShortAddress(selectedRecp, 3));
            setLoadingSend(false);
            setIsBusy(false);
          });
        } else if (getSelectedAsset(selectedAsset)?.type == 'EarthArt') {
          const callback = (path: string) => console.log(path);
          controller.assets.transferEarthArt(secret, selectedAsset, selectedRecp, selectedAmount, address, callback).then(() => {

            setTxCompleteTxt('Successfully transferred to ' + getShortAddress(selectedRecp, 3));
            setLoadingSend(false);
            setIsBusy(false);
          });
        }
        else {
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




  return <div className={styles.page}><>
    <Header
      backOverride={step1 ? undefined : txCompleteTxt === '' ? onBackClick : undefined}
      centerText
      showMenu
      text={'Send'}
      type={'wallet'} />
    <div className={styles.pagecont}
    >
      {!(txCompleteTxt === undefined || txCompleteTxt === '') && <div
        className={styles.paymentDone}>
        {txCompleteTxt}
      </div>}
      {step1
        ? <div className={styles.innercontainer}>
          <div className={styles.earthInputLabel}>Add recipient</div>
          <AddressInput
            initialValue={selectedRecp}
            recpErrorCallback={setRecpError}
            recpCallback={setSelectedRecp}
            inputType={selectedAccount?.symbol}
            autoFocus={true}
            tokenId={getSelectedAsset(selectedAsset)?.tokenId}
          />
          <div className={styles.assetSelectionDivCont}>
            <div className={styles.earthInputLabel}>
              Asset
            </div>
            <div className={styles.tokenSelectionDiv}>
              {selectedAsset === selectedAccount?.symbol && <SelectedAsset
                onSelectedAssetClick={toggle}
                label={selectedAccount?.symbol}
                icon={getSymbol(selectedAccount?.symbol)?.icon || ''}
                loading={currentBalance?.loading}
                showDropdown={assets?.length === 0 || assets?.length === undefined}
                balanceTxt={currentBalance === null
                  ? `Balance: `
                  : `Balance: ${(currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)).toFixed(7)} ${currentBalance?.currency?.symbol}`
                }
              />}
              {getSelectedAsset(selectedAsset) && <SelectedAsset
                onSelectedAssetClick={toggle}
                label={selectedAssetObj?.label}
                loading={false}
                balanceTxt={selectedAssetObj?.balanceTxt}
                icon={selectedAssetObj?.icon || getTokenInfo(selectedAsset)?.icon}
              />
              }
              {toggleAssetDropdown &&
                <div className={styles.assetOptions}>
                  <AssetOption
                    onAssetOptionClick={() => toggleAndSetAsset(selectedAccount?.symbol || '')}
                    label={selectedAccount?.symbol}
                    icon={getSymbol(selectedAccount?.symbol)?.icon || ''}
                    balanceTxt={currentBalance === null
                      ? `Balance: `
                      : `Balance: ${currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals)} ${currentBalance?.currency?.symbol}`
                    }
                  />
                  {assets?.map((asset: keyable, index: number) => <AssetOption
                    key={index}
                    onAssetOptionClick={() => toggleAndSetAsset(asset?.id || index)}
                    label={asset.label}
                    icon={asset.icon || getTokenInfo(asset?.id).icon}
                    balanceTxt={asset?.balanceTxt}
                  />
                  )}
                </div>
              }
            </div>
          </div>
          {selectedAsset === selectedAccount?.symbol && <AmountInput
            initialValue={selectedAmount.toString()}
            address={address}
            fees={fees}
            amountCallback={setSelectedAmount}
            errorCallback={setError}
          />}
          {getSelectedAsset(selectedAsset) && getSelectedAsset(selectedAsset).format != 'nft' && <AmountInput
            initialValue={selectedAmount.toString()}
            address={address}
            fees={fees}
            tokenId={getSelectedAsset(selectedAsset)?.tokenId}
            amountCallback={setSelectedAmount}
            errorCallback={setError}
          />
          }
          {(selectedAccount?.symbol == 'MATIC' || selectedAccount?.symbol == 'ETH') && <><div className={styles.earthInputLabel}>Transaction Fee</div>
            <div className={styles.feeSelector}>
              {feesArr.map((feeObj: keyable, index: number) => <div
                onClick={() => changeFees(index)}
                key={feeObj?.label} className={clsx(styles.feeSelectCont, feesOptionSelected == index && styles.feeSelectCont_selected)}>
                <div className={styles.feeLabel}>{feeObj?.label}</div>
                <div className={styles.feePrice}>{feeObj?.gas?.toFixed(7)}{selectedAccount?.symbol}</div>
                <FeesPriceInUSD gas={feeObj?.gas} symbol={selectedAccount?.symbol} />
              </div>)}
            </div>
            <div className={styles.customizeLink}>Advanced Options</div>
          </>}
        </div>
        : <div className={styles.confirmPage}>
          {selectedAsset === selectedAccount?.symbol ? <div className={styles.confirmAmountCont}>
            <img
              className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
              src={getSymbol(selectedAccount?.symbol)?.icon}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = ICON_PLACEHOLDER;
              }}
            />
            <div>
              <div className={styles.tokenText}>{getSymbol(selectedAccount?.symbol)?.name}</div>
              <div className={styles.tokenAmount}>{selectedAmount} {selectedAccount?.symbol}</div>
              <div className={styles.tokenValue}>${(selectedAmount * currentUSDValue?.usd).toFixed(3)}</div>
            </div>

          </div>
            : (getSelectedAsset(selectedAsset)?.type == 'DIP20' || getSelectedAsset(selectedAsset)?.type == 'ERC20') ? <div className={styles.confirmAmountCont}>
              <img
                className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
                src={getTokenInfo(selectedAsset)?.icon}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = ICON_PLACEHOLDER;
                }}
              />
              <div>
                <div className={styles.tokenText}>{getTokenInfo(selectedAsset)?.name}</div>
                <div className={styles.tokenAmount}>{selectedAmount.toFixed(5)} {getTokenInfo(selectedAsset)?.symbol}</div>
                <div className={styles.tokenValue}>${(selectedAmount * getSelectedAsset(selectedAsset)?.usd).toFixed(3)}</div>
              </div>
            </div> :
              <div className={styles.confirmAmountCont}>
                <img
                  className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
                  src={getTokenImageURL(selectedAssetObj)}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = ICON_PLACEHOLDER;
                  }}
                />
                <div>
                  <div className={styles.tokenText}>{selectedAssetObj?.tokenIndex}</div>
                  <div className={styles.tokenAmount}>1 NFT</div>
                </div>
              </div>
          }
          {(getSelectedAsset(selectedAsset)?.type == 'DIP20' || getSelectedAsset(selectedAsset)?.type == 'ERC20') && <div className={styles.feeCont}>
            <div className={styles.feeRow}>
              <div className={styles.feeTitle}>Transaction Fee</div>
              <div>
                <div className={styles.feeAmount}>{fees} {getTokenInfo(selectedAsset)?.symbol}</div>
                <div className={styles.feeValue}>${(fees * getSelectedAsset(selectedAsset)?.usd).toFixed(3)}</div>
              </div>
            </div>

            <div className={styles.feeRow}>
              <div className={styles.feeTotal}>Total</div>
              <div>
                <div className={styles.feeAmount}>{(selectedAmount + fees).toFixed(getTokenInfo(selectedAsset)?.decimals)}</div>
                <div className={styles.feeValue}>${((selectedAmount + fees) * getSelectedAsset(selectedAsset)?.usd).toFixed(3)}</div>
              </div>
            </div>

          </div>}
          {selectedAsset === selectedAccount?.symbol && <div className={styles.feeCont}>
            <div className={styles.feeRow}>
              <div className={styles.feeTitle}>Transaction Fee</div>
              <div>
                <div className={styles.feeAmount}>{fees} {selectedAccount?.symbol}</div>
                <div className={styles.feeValue}>${(fees * currentUSDValue?.usd).toFixed(3)}</div>
              </div>
            </div>

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
          disabled={(selectedAmount == 0 && getSelectedAsset(selectedAsset)?.format != 'nft') || loadingSend || !selectedRecp || recpError !== '' || error !== ''}
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
  icon: string,
  label: string,
  loading: boolean,
  balanceTxt: string,
  showDropdown?: boolean,
  onSelectedAssetClick: () => void,
}

interface AssetOptionProps {
  icon: string,
  label: string,
  balanceTxt: string,
  onAssetOptionClick: () => void
}

const SelectedAsset = ({ icon, label, loading, balanceTxt, onSelectedAssetClick, showDropdown }: SelectedAssetProps) => <div
  onClick={showDropdown ? console.log : onSelectedAssetClick}
  className={clsx(styles.selectedNetworkDiv, showDropdown && styles.selectedNetworkDiv_noPointer)}>
  <img
    className={styles.tokenLogo}
    src={icon}
    onError={({ currentTarget }) => {
      currentTarget.onerror = null;
      currentTarget.src = ICON_PLACEHOLDER;
    }}
  />
  <div className={styles.tokenSelectionLabelDiv}>
    <div className={styles.tokenLabel}>{label}</div>
    <div className={styles.tokenBalance}>
      {loading
        ? <SkeletonTheme color="#222"
          highlightColor="#000">
          <Skeleton width={150} />
        </SkeletonTheme>
        : <span className={styles.tokenBalanceText}>{balanceTxt}</span>
      }
    </div>
  </div>
  {!showDropdown && <img className={styles.iconcaret} src={ICON_CARET} />}
</div>

const AssetOption = ({ icon, label, balanceTxt, onAssetOptionClick }: AssetOptionProps) => <div
  onClick={onAssetOptionClick}
  className={clsx(styles.selectedNetworkDiv, styles.selectedNetworkDivOption)}>
  <img
    className={styles.tokenLogo}
    src={icon}
    onError={({ currentTarget }) => {
      currentTarget.onerror = null;
      currentTarget.src = ICON_PLACEHOLDER;
    }}
  />
  <div className={styles.tokenSelectionLabelDiv}>
    <div className={styles.tokenLabel}>{label}</div>
    <div className={styles.tokenBalance}>
      <span className={styles.tokenBalanceText}>{balanceTxt}</span>
    </div>
  </div>
</div>

const FeesPriceInUSD = ({ symbol, gas }: { symbol: string, gas: number }) => {
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(symbol)?.coinGeckoId || ''));
  return <div className={styles.feePriceUSD}>${(gas * currentUSDValue.usd)?.toFixed(4)}</div>
}

const AmountInput = ({ address, fees, initialValue, amountCallback, errorCallback, tokenId }: {
  address: string,
  fees: any,
  initialValue?: string,
  amountCallback: (amount: number) => void,
  errorCallback: (error: string) => void,
  tokenId?: string
}) => {
  const selectedAccount = useSelector(selectAccountById(address));

  const currentBalance: keyable = useSelector(selectBalanceById(address));
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);
  const tokenInfo = useSelector(selectInfoBySymbolOrToken(tokenId || '', address));

  const price = tokenInfo?.type == "DIP20" || tokenInfo?.type == "ERC20" ? tokenInfo?.usd : currentUSDValue?.usd;

  useEffect(() => {
    if (initialValue != undefined && initialValue != '0')
      changeAmount(initialValue);
  }, [(initialValue != '0' && initialValue != undefined), fees, tokenId]);


  useEffect(() => {
    amountCallback(selectedAmount);
  }, [amountCallback, selectedAmount]);

  useEffect(() => {
    errorCallback(error);
  }, [errorCallback, error]);

  const loadMaxAmount = useCallback((): void => {
    let maxAmount
    if (tokenInfo?.type == "DIP20" || tokenInfo?.type == "ERC20") {
      maxAmount = tokenInfo.balance / Math.pow(10, tokenInfo.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));

    } else {
      maxAmount = currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    }
    changeAmount(maxAmount.toString());
  }, [currentBalance, fees]);

  const changeAmount = (amount: string) => {

    setInitialized(true);

    let maxAmount
    if (tokenInfo?.type == "DIP20" || tokenInfo?.type == "ERC20") {
      maxAmount = tokenInfo.balance / Math.pow(10, tokenInfo.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));

    } else {
      maxAmount = currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    }

    const _amount = parseFloat(amount);

    if (isNaN(_amount)) {
      setSelectedAmount(_amount);
      setError(`Amount cannot be empty.`);
    }
    else if (_amount !== 0 && _amount <= maxAmount) {
      setSelectedAmount(_amount)
      setError('');
    }
    else if (_amount == 0) {
      if (fees == 0) {
        setSelectedAmount(_amount)
        setError(`Amount cannot be zero.`);
      } else {
        setSelectedAmount(_amount)
        setError(`Amount cannot be zero. Transaction fees is ${fees} ${selectedAccount?.symbol}`);
      }
    }
    else if (_amount > maxAmount) {
      setSelectedAmount(_amount);
      setError(`Insufficient balance.`);
    }

  }
  return <div>
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
      onChange={(e) => changeAmount(e.target.value)}
      placeholder="amount up to 8 decimal places"
      required
      step="0.001"
      type="number"
      value={selectedAmount}
    />
    {!(error != '') && initialized && <div
      className={styles.priceInput}
    >${((selectedAmount + fees) * price).toFixed(2)}</div>}
    {error != '' && (
      <div
        className={styles.amountError}
      >
        <Warning
          isBelowInput
          isDanger
        >
          {error}
        </Warning>
      </div>
    )}
  </div>

}
export default withRouter(WalletSendTokens);
