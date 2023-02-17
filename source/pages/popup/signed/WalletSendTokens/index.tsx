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
import { validateMnemonic } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceById } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';
import { DEFAULT_ICP_FEES } from '~global/constant';
import indexToHash from './indexToHash';
import { useHistory } from 'react-router-dom';
import { selectActiveTokensAndAssetsByAccountId } from '~state/wallet';
import ICON_CARET from '~assets/images/icon_caret.svg';
import useQuery from '~hooks/useQuery';
import { listNFTsExt, transferNFTsExt } from '@earthwallet/assets';
import { getShortAddress } from '~utils/common';
import { getTokenImageURL } from '~global/nfts';
import AddressInput from '~components/AddressInput';
import { getTokenInfo } from '~global/tokens';
import { selectInfoBySymbolOrToken } from '~state/tokens';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import { getERC20TransferGasLimit, getERC721TransferGasLimit, getFeesExtended, getMaxAmount_ETH } from '~utils/services';
import { debounce } from 'lodash';
import { getFeeRateAndFees_BTC_DOGE } from '~utils/btc';
import { i18nT } from '~i18n/index';

const MIN_LENGTH = 6;
const DEFAULT_FEE_INDEX = 1;

interface keyable {
  [key: string]: any;
}

interface Props extends RouteComponentProps<{ accountId: string }> { }

const WalletSendTokens = ({
  match: {
    params: { accountId },
  },
}: Props) => {
  const [step1, setStep1] = useState(true);
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;
  const [done, setDone] = useState(false);

  const controller = useController();
  const currentBalance: keyable = useSelector(selectBalanceById(accountId));
  const currentUSDValue: keyable = useSelector(
    selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || '')
  );

  const assets: keyable = useSelector(
    selectActiveTokensAndAssetsByAccountId(accountId)
  );


  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [pass, setPass] = useState('');
  const [recpError, setRecpError] = useState('');

  const [error, setError] = useState('');
  const [txError, setTxError] = useState('');
  const [fees, setFees] = useState<number>(0);
  const [feesArr, setFeesArr] = useState<keyable[]>([]);
  const [feesOptionSelected, setFeesOptionSelected] =
    useState<number>(DEFAULT_FEE_INDEX);
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedAssetObj, setSelectedAssetObj] = useState<keyable>({});

  const [toggleAssetDropdown, setToggleAssetDropdown] =
    useState<boolean>(false);
  const queryParams = useQuery();

  const toggle = React.useCallback(() => {
    setToggleAssetDropdown((v) => !v);
  }, []);

  const toggleAndSetAsset = React.useCallback((asset: string) => {
    toggle();
    setSelectedAsset(asset);
    setSelectedAssetObj(getSelectedAsset(asset));
    setSelectedAmount(0);
    if (selectedAccount?.symbol == 'ETH' || selectedAccount?.symbol == 'MATIC') {
      fetchFeesETH();
    }
  }, []);

  const [isBusy, setIsBusy] = useState(false);
  const [txCompleteTxt, setTxCompleteTxt] = useState<string>('');
  const history = useHistory();
  const tokenId = queryParams.get('tokenId');
  const assetId = queryParams.get('assetId');
  const queryRecipient = queryParams.get('recipient');
  const getSelectedAsset = (assetId: string) =>
    assets.filter((asset: keyable) => asset.id === assetId)[0];

  useEffect(() => {
    if (queryRecipient !== null) {
      setSelectedRecp(queryRecipient);
    }
  }, [queryRecipient !== null]);

  useEffect(() => {
    if (assetId === null && tokenId === null) {
      setSelectedAsset(selectedAccount?.symbol);
    } else if (assetId !== null) {
      setSelectedAsset(assetId || '');
      setSelectedAssetObj(getSelectedAsset(assetId || ''));
    } else if (tokenId !== null) {
      setSelectedAsset(tokenId || '');
      setSelectedAssetObj(getSelectedAsset(tokenId || ''));
    }
  }, [assetId !== null, tokenId !== null]);


  const fetchFeesETH = async (amount?: string) => {
    setIsBusy(true);


    let gasLimit = 21000;
    if (getSelectedAsset(selectedAsset)?.format == "token") {
      gasLimit = await getERC20TransferGasLimit(
        getSelectedAsset(selectedAsset)?.contractAddress,
        selectedAccount.address,
        selectedRecp,
        selectedAccount.symbol,
        amount,
        getSelectedAsset(selectedAsset)?.decimals
      );
    } else if (getSelectedAsset(selectedAsset)?.format == "nft") {
      gasLimit = await getERC721TransferGasLimit(
        getSelectedAsset(selectedAsset)?.contractAddress,
        selectedAccount.address,
        selectedRecp,
        selectedAccount.symbol,
        getSelectedAsset(selectedAsset).tokenID,
      );
    }
    getFeesExtended(selectedAccount?.symbol, gasLimit).then(
      (_feesArr: keyable[]) => {
        setFeesOptionSelected(DEFAULT_FEE_INDEX);
        _feesArr[DEFAULT_FEE_INDEX] &&
          setFees(_feesArr[DEFAULT_FEE_INDEX]?.gas);
        setFeesArr(_feesArr);
      }
    );


    setIsBusy(false);
    return;
  };

  const fetchData = async (selectedAmount: any, cb: any) => {
    const res = await fetchFeesETH(selectedAmount);
    cb(res);
  };

  const debouncedFetchData = debounce((selectedAmount, cb) => {
    fetchData(selectedAmount, cb);
  }, 500);

  React.useEffect(() => {
    if (getSelectedAsset(selectedAsset)?.format == "token" && (selectedAccount.symbol == "MATIC" || selectedAccount.symbol == "ETH")) {
      debouncedFetchData(selectedAmount, (res: any) => {
        console.log(res, "debounced");
      });
    }
  }, [selectedAmount]);

  useEffect(() => {
    controller.accounts.getBalancesOfAccount(selectedAccount).then(() => { });
    tokenId !== null && controller.tokens.getTokenBalances(accountId);

    if (selectedAccount?.symbol === 'BTC' || selectedAccount?.symbol === 'DOGE') {
      setIsBusy(true);

      getFeeRateAndFees_BTC_DOGE(selectedAccount?.symbol).then((resp) => {
        setIsBusy(false);
        setFees(
          resp.fees
        );
        setFeesArr([resp]);
      });
    } else if (selectedAccount?.symbol === 'ICP') {
      if (tokenId == null) {
        setFees(DEFAULT_ICP_FEES);
      } else {
        setFees(getTokenInfo(tokenId)?.sendFees);
      }
    } else if (
      selectedAccount?.symbol === 'MATIC' ||
      selectedAccount?.symbol === 'ETH'
    ) {
      fetchFeesETH();
    }
  }, [
    selectedAccount?.id === address,
    getSelectedAsset(selectedAsset)?.format == 'nft',
  ]);

  const changeFees = useCallback(
    (index: number) => {
      setFeesOptionSelected(index);
      setFees(feesArr[index]?.gas);
    },
    [feesArr[0]]
  );

  const onConfirm = useCallback(() => {
    if (selectedAsset !== selectedAccount?.symbol) {
      setError('');
      setStep1(false);
    } else {
      setStep1(false);
    }
  }, [fees, selectedAmount, currentBalance, selectedAccount, selectedAsset]);

  const onBackClick = useCallback(() => {
    setStep1(true);
  }, []);

  const transferForAll = async () => {
    setIsBusy(true);
    setTxError('');
    let mnemonic = '';
    try {
      mnemonic = decryptString(selectedAccount?.vault.encryptedMnemonic, pass);
    } catch (error) {
      setError(i18nT('common.wrongPass'));
      setIsBusy(false);
    }
    try {
      if (selectedAmount === 0) {
        getSelectedAsset(selectedAsset)?.format != 'nft' &&
        alert(i18nT('walletSendTokens.noZeroAmount'));
      }
      let hash: any;
      if (selectedAccount?.symbol == 'BTC' || selectedAccount?.symbol == 'DOGE') {
        hash = await controller.accounts.send_BTC_DOGE(
          selectedRecp,
          selectedAmount,
          mnemonic,
          address,
          selectedAccount?.symbol,
          feesArr[0]?.feeRate
        );
      } else if (selectedAccount?.symbol == 'ETH' || selectedAccount?.symbol == 'MATIC') {
        if (selectedAsset === selectedAccount?.symbol) {
          const resp = await controller.accounts.sendETH(
            selectedRecp,
            selectedAmount,
            mnemonic,
            feesArr,
            feesOptionSelected,
            selectedAccount?.symbol
          );
          hash = resp;
        } else if (getSelectedAsset(selectedAsset)?.format == 'nft') {
          hash = await controller.accounts.sendERC721_ETH(
            selectedRecp,
            selectedAccount.address,
            mnemonic,
            getSelectedAsset(selectedAsset),
            feesArr,
            feesOptionSelected,
            selectedAccount?.symbol
          );
        } else if (getSelectedAsset(selectedAsset)?.format == "token") {
          hash = await controller.accounts.sendERC20_ETH(
            selectedRecp,
            selectedAmount,
            mnemonic,
            getSelectedAsset(selectedAsset),
            feesArr,
            feesOptionSelected,
            selectedAccount?.symbol)
        }
      }
      await controller.accounts
        .getBalancesOfAccount(selectedAccount)
        .then(() => { });
      setLoadingSend(false);
      setTxCompleteTxt(
        i18nT('walletSendTokens.payDone') || hash || ''
      );
      setDone(true);
      setIsBusy(false);
    } catch (error) {
      console.log(error, typeof error);
      setTxError(typeof error == "string" ? error : 'Unable to send! Please try again later');
      setLoadingSend(false);
      setIsBusy(false);
    }
  };

  const transferAssetsForICP = async () => {
    setIsBusy(true);
    setTxError('');

    let secret = '';

    try {
      secret = decryptString(selectedAccount?.vault.encryptedJson, pass);
    } catch (error) {
      setError(i18nT('common.wrongPass'));
      setIsBusy(false);
    }

    if (isJsonString(secret)) {
      const currentIdentity = Secp256k1KeyIdentity.fromJSON(secret);
      const address = principal_to_address(currentIdentity.getPrincipal());

      setLoadingSend(true);
      if (selectedAsset === selectedAccount?.symbol) {
        try {
          if (selectedAmount === 0) {
            alert(i18nT('walletSendTokens.noZeroAmount'));
          }
          const index: BigInt = await controller.accounts.sendICP(
            secret,
            selectedRecp,
            selectedAmount
          );

          const hash: string = await indexToHash(index);

          await controller.accounts
            .getBalancesOfAccount(selectedAccount)
            .then(() => {
              if (hash !== undefined) {
                history.replace(`/account/transaction/${hash}`);
              } else {
                setLoadingSend(false);
                setTxCompleteTxt(i18nT('walletSendTokens.payDone'));
                setDone(true);
                setIsBusy(false);
              }
            });
        } catch (error) {
          console.log(error);
          setTxError(i18nT('walletSendTokens.tryAgain') + JSON.stringify(error));
          setLoadingSend(false);
          setIsBusy(false);
        }
      } else {
        if (
          getSelectedAsset(selectedAsset)?.type == 'DIP20' ||
          getSelectedAsset(selectedAsset)?.type == 'ERC20'
        ) {
          const callback = (path: string) => console.log(path);
          controller.tokens
            .transferToken(
              secret,
              selectedAsset,
              selectedRecp,
              selectedAmount,
              accountId,
              callback
            )
            .then(() => {
              setTxCompleteTxt(
                i18nT('walletSendTokens.successTxn') +
                getShortAddress(selectedRecp, 3)
              );
              setDone(true);
              setLoadingSend(false);
              setIsBusy(false);
            });
        } else if (getSelectedAsset(selectedAsset)?.type == 'EarthArt') {
          const callback = (path: string) => console.log(path);
          controller.assets
            .transferEarthArt(
              secret,
              selectedAsset,
              selectedRecp,
              selectedAmount,
              address,
              callback
            )
            .then(() => {
              setTxCompleteTxt(
                i18nT('walletSendTokens.successTxn') +
                getShortAddress(selectedRecp, 3)
              );
              setDone(true);
              setLoadingSend(false);
              setIsBusy(false);
            });
        } else {
          try {
            if (selectedAssetObj?.forSale === true) {
              await listNFTsExt(
                selectedAssetObj?.canisterId,
                currentIdentity,
                selectedAssetObj?.tokenIndex,
                0,
                true
              );
              await transferNFTsExt(
                selectedAssetObj?.canisterId,
                currentIdentity,
                selectedRecp,
                selectedAssetObj?.tokenIndex
              );
            } else {
              await transferNFTsExt(
                selectedAssetObj?.canisterId,
                currentIdentity,
                selectedRecp,
                selectedAssetObj?.tokenIndex
              );
            }

            setTxCompleteTxt(
              i18nT('walletSendTokens.successNftTxn') +
              getShortAddress(selectedRecp, 3)
            );
            setDone(true);
            setLoadingSend(false);
            setIsBusy(false);
            controller.assets.updateTokenDetails({
              id: selectedAsset,
              address: selectedRecp,
            });
            controller.assets.getICPAssetsOfAccount({ address, symbol: 'ICP' });
            controller.assets.getICPAssetsOfAccount({
              address: selectedRecp,
              symbol: 'ICP',
            });
          } catch (error) {
            console.log(error);
            setTxError(i18nT('walletSendTokens.tryAgain') + JSON.stringify(error));
            setLoadingSend(false);
            setIsBusy(false);
          }
        }
      }
    } else {
      setError(i18nT('common.wrongPass'));
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
        secret =
          selectedAccount?.symbol !== 'ICP'
            ? decryptString(selectedAccount?.vault.encryptedMnemonic, password)
            : decryptString(selectedAccount?.vault.encryptedJson, password);
      } catch (error) {
        setError(i18nT('common.wrongPass'));
      }
      if (
        selectedAccount?.symbol === 'ICP'
          ? !isJsonString(secret)
          : !validateMnemonic(secret)
      ) {
        setError(i18nT('common.wrongPass'));
      }
    },
    [selectedAccount]
  );

  return (
    <div className={styles.page}>
      <>
        <Header
          backOverride={
            step1 ? undefined : txCompleteTxt === '' ? onBackClick : done ? () => history.push('/account/details/' + accountId) : undefined
          }
          centerText
          showMenu
          text={i18nT('walletSendTokens.send')}
          type={'wallet'}
        />
        <div className={styles.pagecont}>
          {!(txCompleteTxt === undefined || txCompleteTxt === '') && (
            <div className={styles.paymentDone}>{txCompleteTxt}</div>
          )}
          {step1 ? (
            <div className={styles.innercontainer}>
              <div className={styles.earthInputLabel}>{i18nT('walletSendTokens.addRecp')}</div>
              <AddressInput
                initialValue={selectedRecp}
                recpErrorCallback={setRecpError}
                recpCallback={setSelectedRecp}
                inputType={selectedAccount?.symbol}
                autoFocus={true}
                tokenId={getSelectedAsset(selectedAsset)?.tokenId}
              />
              <div className={styles.assetSelectionDivCont}>
                <div className={styles.earthInputLabel}>{i18nT('walletSendTokens.selectedAsset')}</div>
                <div className={styles.tokenSelectionDiv}>
                  {selectedAsset === selectedAccount?.symbol && (
                    <SelectedAsset
                      onSelectedAssetClick={toggle}
                      label={selectedAccount?.symbol}
                      icon={getSymbol(selectedAccount?.symbol)?.icon || ''}
                      loading={currentBalance?.loading}
                      showDropdown={
                        assets?.length === 0 || assets?.length === undefined
                      }
                      balanceTxt={
                        currentBalance === null
                          ? i18nT('walletSendTokens.balance')
                          : i18nT('walletSendTokens.balance') + ` ${(
                            currentBalance?.value /
                            Math.pow(10, currentBalance?.currency?.decimals)
                          ).toFixed(7)} ${currentBalance?.currency?.symbol}`
                      }
                    />
                  )}
                  {getSelectedAsset(selectedAsset) && (
                    <SelectedAsset
                      onSelectedAssetClick={toggle}
                      label={selectedAssetObj?.label}
                      loading={false}
                      balanceTxt={selectedAssetObj?.balanceTxt}
                      icon={
                        selectedAssetObj?.icon ||
                        getTokenInfo(selectedAsset)?.icon
                      }
                    />
                  )}
                  {toggleAssetDropdown && (
                    <div className={styles.assetOptions}>
                      <AssetOption
                        onAssetOptionClick={() =>
                          toggleAndSetAsset(selectedAccount?.symbol || '')
                        }
                        label={selectedAccount?.symbol}
                        icon={getSymbol(selectedAccount?.symbol)?.icon || ''}
                        balanceTxt={
                          currentBalance === null
                            ? i18nT('walletSendTokens.balance')
                            : i18nT('walletSendTokens.balance') + ` ${currentBalance?.value /
                            Math.pow(10, currentBalance?.currency?.decimals)
                            } ${currentBalance?.currency?.symbol}`
                        }
                      />
                      {assets?.map((asset: keyable, index: number) => (
                        <AssetOption
                          key={index}
                          onAssetOptionClick={() =>
                            toggleAndSetAsset(asset?.id || index)
                          }
                          label={asset.label}
                          icon={asset.icon || getTokenInfo(asset?.id).icon}
                          balanceTxt={asset?.balanceTxt}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {selectedAsset === selectedAccount?.symbol && (
                <AmountInput
                  initialValue={selectedAmount.toString()}
                  accountId={accountId}
                  fees={fees}
                  amountCallback={setSelectedAmount}
                  errorCallback={setError}
                  feesArr={feesArr}
                  feesOptionSelected={feesOptionSelected}
                />
              )}
              {getSelectedAsset(selectedAsset) &&
                getSelectedAsset(selectedAsset).format != 'nft' && (
                  <AmountInput
                    initialValue={selectedAmount.toString()}
                    accountId={accountId}
                    fees={fees}
                    tokenId={getSelectedAsset(selectedAsset)?.id}
                    amountCallback={setSelectedAmount}
                    errorCallback={setError}
                    feesArr={feesArr}
                    feesOptionSelected={feesOptionSelected}
                  />
                )}
              {(selectedAccount?.symbol == 'MATIC' ||
                selectedAccount?.symbol == 'ETH') && (
                  <>
                    <div className={styles.earthInputLabel}>{i18nT('walletSendTokens.txnFee')}</div>
                    <div className={styles.feeSelector}>
                      {feesArr.map((feeObj: keyable, index: number) => (
                        <div
                          onClick={() => changeFees(index)}
                          key={feeObj?.label}
                          className={clsx(
                            styles.feeSelectCont,
                            feesOptionSelected == index &&
                            styles.feeSelectCont_selected
                          )}
                        >
                          <div className={styles.feeLabel}>{feeObj?.label}</div>
                          <div className={styles.feePrice}>
                            {feeObj?.gas?.toFixed(7)}
                            {selectedAccount?.symbol}
                          </div>
                          <FeesPriceInUSD
                            gas={feeObj?.gas}
                            symbol={selectedAccount?.symbol}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
            </div>
          ) : (
            <div className={styles.confirmPage}>
              {selectedAsset === selectedAccount?.symbol ? (
                <div className={styles.confirmAmountCont}>
                  <img
                    className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
                    src={getSymbol(selectedAccount?.symbol)?.icon || ICON_PLACEHOLDER}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = ICON_PLACEHOLDER;
                    }}
                  />
                  <div>
                    <div className={styles.tokenText}>
                      {getSymbol(selectedAccount?.symbol)?.name}
                    </div>
                    <div className={styles.tokenAmount}>
                      {selectedAmount} {selectedAccount?.symbol}
                    </div>
                    <div className={styles.tokenValue}>
                      ${(selectedAmount * currentUSDValue?.usd).toFixed(3)}
                    </div>
                  </div>
                </div>
              ) : (getSelectedAsset(selectedAsset)?.type == 'DIP20' ||
                getSelectedAsset(selectedAsset)?.type == 'ERC20' || getSelectedAsset(selectedAsset)?.format == 'token') ? (
                <div className={styles.confirmAmountCont}>
                  <img
                    className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
                    src={getTokenInfo(selectedAsset)?.icon || ICON_PLACEHOLDER}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = ICON_PLACEHOLDER;
                    }}
                  />
                  <div>
                    <div className={styles.tokenText}>
                      {getTokenInfo(selectedAsset)?.name || getSelectedAsset(selectedAsset)?.name}
                    </div>
                    <div className={styles.tokenAmount}>
                      {selectedAmount.toFixed(5)}{' '}
                      {getTokenInfo(selectedAsset)?.symbol || getSelectedAsset(selectedAsset)?.symbol}
                    </div>
                    {!isNaN(getSelectedAsset(selectedAsset)?.usd) && <div className={styles.tokenValue}>
                      $
                      {(
                        selectedAmount * getSelectedAsset(selectedAsset)?.usd
                      ).toFixed(3)}
                    </div>}
                  </div>
                </div>
              ) : (
                <div className={styles.confirmAmountCont}>
                  <img
                    className={clsx(styles.tokenLogo, styles.tokenLogoConfirm)}
                    src={getTokenImageURL(selectedAssetObj) || ICON_PLACEHOLDER}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = ICON_PLACEHOLDER;
                    }}
                  />
                  <div>
                    <div className={styles.tokenText}>
                      {selectedAssetObj?.tokenIndex}
                    </div>
                    <div className={styles.tokenAmount}>1 NFT</div>
                  </div>
                </div>
              )}
              {(getSelectedAsset(selectedAsset)?.type == 'DIP20' ||
                getSelectedAsset(selectedAsset)?.type == 'ERC20' || getSelectedAsset(selectedAsset)?.format == 'token') && (
                  <div className={styles.feeCont}>
                    <div className={styles.feeRow}>
                      <div className={styles.feeTitle}>{i18nT('walletSendTokens.txnFee')}</div>
                      {(selectedAccount.symbol == "MATIC" || selectedAccount.symbol == "ETH") ?
                        <div>
                          <div className={styles.feeAmount}>
                            {fees} {selectedAccount.symbol}
                          </div>
                          <div className={styles.feeValue}>
                            $
                            {(fees * currentUSDValue?.usd).toFixed(
                              3
                            )}
                          </div>
                        </div>
                        : <div>
                          <div className={styles.feeAmount}>
                            {fees} {getTokenInfo(selectedAsset)?.symbol}
                          </div>
                          <div className={styles.feeValue}>
                            $
                            {(fees * getSelectedAsset(selectedAsset)?.usd).toFixed(
                              3
                            )}
                          </div>
                        </div>}
                    </div>

                    <div className={styles.feeRow}>
                      <div className={styles.feeTotal}>{i18nT('walletSendTokens.total')}</div>
                      {(selectedAccount.symbol == "MATIC" || selectedAccount.symbol == "ETH") ? <div>
                        <div className={styles.feeAmount}>
                          {selectedAmount} {getSelectedAsset(selectedAsset)?.symbol}
                        </div>
                        <div className={styles.feeValue}>
                          {fees} {selectedAccount.symbol}
                        </div>
                      </div> : <div>
                        <div className={styles.feeAmount}>
                          {(selectedAmount + fees).toFixed(
                            getTokenInfo(selectedAsset)?.decimals
                          )}
                        </div>
                        <div className={styles.feeValue}>
                          $
                          {(
                            (selectedAmount + fees) *
                            getSelectedAsset(selectedAsset)?.usd
                          ).toFixed(3)}
                        </div>
                      </div>}
                    </div>
                  </div>
                )}
              {selectedAsset === selectedAccount?.symbol && (
                <div className={styles.feeCont}>
                  <div className={styles.feeRow}>
                    <div className={styles.feeTitle}>{i18nT('walletSendTokens.txnFee')}</div>
                    <div>
                      <div className={styles.feeAmount}>
                        {fees} {selectedAccount?.symbol}
                      </div>
                      <div className={styles.feeValue}>
                        ${(fees * currentUSDValue?.usd).toFixed(3)}
                      </div>
                    </div>
                  </div>

                  <div className={styles.feeRow}>
                    <div className={styles.feeTotal}>{i18nT('walletSendTokens.total')}</div>
                    <div>
                      <div className={styles.feeAmount}>
                        {(selectedAmount + fees).toFixed(
                          currentBalance?.currency?.decimals
                        )}
                      </div>
                      <div className={styles.feeValue}>
                        $
                        {(
                          (selectedAmount + fees) *
                          currentUSDValue?.usd
                        ).toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <InputWithLabel
                data-export-password
                disabled={isBusy}
                isError={pass.length < MIN_LENGTH || !!error}
                label={i18nT('common.passwordForAc')}
                onChange={onPassChange}
                placeholder={i18nT('common.requiredPlaceholder')}
                type="password"
              />
              {error && (
                <Warning isBelowInput isDanger>
                  {error}
                </Warning>
              )}
            </div>
          )}
          {txError && (
            <div className={styles.noBalanceError}>
              <Warning isBelowInput isDanger>
                {txError}
              </Warning>
            </div>
          )}
        </div>
        <div
          style={{
            margin: '0 30px 30px 30px',
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        >
          {step1 ? (
            <NextStepButton
              disabled={
                (selectedAmount <= 0 &&
                  getSelectedAsset(selectedAsset)?.format != 'nft') ||
                loadingSend ||
                !selectedRecp ||
                recpError !== '' ||
                error !== ''
              }
              loading={isBusy}
              onClick={onConfirm}
            >
              {i18nT('walletSendTokens.next')}
            </NextStepButton>
          ) : (
            <NextStepButton
              disabled={
                loadingSend ||
                !!error ||
                pass.length < MIN_LENGTH ||
                !(txCompleteTxt === undefined || txCompleteTxt === '')
              }
              loading={isBusy || loadingSend}
              onClick={() =>
                selectedAccount?.symbol === 'ICP'
                  ? transferAssetsForICP()
                  : transferForAll()
              }
            >
              {i18nT('walletSendTokens.send')}
            </NextStepButton>
          )}
        </div>
      </>
    </div>
  );
};

interface SelectedAssetProps {
  icon: string;
  label: string;
  loading: boolean;
  balanceTxt: string;
  showDropdown?: boolean;
  onSelectedAssetClick: () => void;
}

interface AssetOptionProps {
  icon: string;
  label: string;
  balanceTxt: string;
  onAssetOptionClick: () => void;
}

const SelectedAsset = ({
  icon,
  label,
  loading,
  balanceTxt,
  onSelectedAssetClick,
  showDropdown,
}: SelectedAssetProps) => (
  <div
    onClick={showDropdown ? console.log : onSelectedAssetClick}
    className={clsx(
      styles.selectedNetworkDiv,
      showDropdown && styles.selectedNetworkDiv_noPointer
    )}
  >
    <img
      className={styles.tokenLogo}
      src={icon || ICON_PLACEHOLDER}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = ICON_PLACEHOLDER;
      }}
    />
    <div className={styles.tokenSelectionLabelDiv}>
      <div className={styles.tokenLabel}>{label}</div>
      <div className={styles.tokenBalance}>
        {loading ? (
          <SkeletonTheme color="#222" highlightColor="#000">
            <Skeleton width={150} />
          </SkeletonTheme>
        ) : (
          <span className={styles.tokenBalanceText}>{balanceTxt}</span>
        )}
      </div>
    </div>
    {!showDropdown && <img className={styles.iconcaret} src={ICON_CARET} />}
  </div>
);

const AssetOption = ({
  icon,
  label,
  balanceTxt,
  onAssetOptionClick,
}: AssetOptionProps) => (
  <div
    onClick={onAssetOptionClick}
    className={clsx(styles.selectedNetworkDiv, styles.selectedNetworkDivOption)}
  >
    <img
      className={styles.tokenLogo}
      src={icon || ICON_PLACEHOLDER}
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
);

const FeesPriceInUSD = ({ symbol, gas }: { symbol: string; gas: number }) => {
  const currentUSDValue: keyable = useSelector(
    selectAssetBySymbol(getSymbol(symbol)?.coinGeckoId || '')
  );
  return (
    <div className={styles.feePriceUSD}>
      ${(gas * currentUSDValue.usd)?.toFixed(4)}
    </div>
  );
};

const AmountInput = ({
  accountId,
  fees,
  initialValue,
  amountCallback,
  errorCallback,
  tokenId,
  feesArr,
  feesOptionSelected
}: {
  accountId: string;
  fees: any;
  initialValue?: string;
  amountCallback: (amount: number) => void;
  errorCallback: (error: string) => void;
  tokenId?: string;
  feesArr: keyable,
  feesOptionSelected: number
}) => {
  const selectedAccount = useSelector(selectAccountById(accountId));

  const currentBalance: keyable = useSelector(selectBalanceById(accountId));
  const currentUSDValue: keyable = useSelector(
    selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || '')
  );
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);
  const tokenInfo = useSelector(
    selectInfoBySymbolOrToken(tokenId || '', accountId)
  );

  const price =
    (tokenInfo?.type == 'DIP20' || tokenInfo?.type == 'ERC20' || tokenInfo?.format == "token")
      ? tokenInfo?.usd
      : currentUSDValue?.usd;

  useEffect(() => {
    if (initialValue != undefined && initialValue != '0')
      changeAmount(initialValue);
  }, [initialValue != '0' && initialValue != undefined, fees, tokenId]);

  useEffect(() => {
    amountCallback(selectedAmount);
  }, [amountCallback, selectedAmount]);

  useEffect(() => {
    errorCallback(error);
  }, [errorCallback, error]);

  const loadMaxAmount = useCallback((): void => {
    let maxAmount;
    if (tokenInfo?.type == "DIP20") {
      maxAmount = tokenInfo.balance / Math.pow(10, tokenInfo.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    } else if (tokenInfo?.type == "token" || tokenInfo?.type == "ERC20") {
      maxAmount = tokenInfo.balance;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    } else {
      if (!(selectedAccount.symbol == "MATIC" || selectedAccount.symbol == "ETH")) {
        maxAmount =
          currentBalance?.value /
          Math.pow(10, currentBalance?.currency?.decimals) -
          fees;
        maxAmount = parseFloat(maxAmount.toFixed(8));
      } else {
        maxAmount = getMaxAmount_ETH((currentBalance?.value /
          Math.pow(10, currentBalance?.currency?.decimals)).toString(), feesArr[feesOptionSelected])
      }
    }
    const amount = maxAmount.toString();
    changeAmount(amount);
  }, [currentBalance, fees, feesArr, feesOptionSelected]);

  const changeAmount = (amount: string) => {
    setInitialized(true);
    let maxAmount;
    if (tokenInfo?.type == "DIP20") {
      maxAmount = tokenInfo.balance / Math.pow(10, tokenInfo.decimals) - fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    } else if (tokenInfo?.format == "token" || tokenInfo?.type == "ERC20") {
      maxAmount = tokenInfo.balance;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    }
    else {
      maxAmount =
        currentBalance?.value /
        Math.pow(10, currentBalance?.currency?.decimals) -
        fees;
      maxAmount = parseFloat(maxAmount.toFixed(8));
    }

    const _amount = parseFloat(amount);

    if (isNaN(_amount)) {
      setSelectedAmount(_amount);
      setError(i18nT('walletSendTokens.noEmpty'));
    } else if (_amount !== 0 && _amount <= maxAmount) {
      setSelectedAmount(_amount);
      setError('');
    } else if (_amount == 0) {
      if (fees == 0) {
        setSelectedAmount(_amount);
        setError(i18nT('walletSendTokens.noZero'));
      } else {
        setSelectedAmount(_amount);
        setError(
          i18nT('walletSendTokens.noZeroWith') + ` ${fees} ${selectedAccount?.symbol}`
        );
      }
    } else if (_amount > maxAmount) {
      setSelectedAmount(_amount);
      setError(i18nT('walletSendTokens.inSuf'));
    }
  };
  return (
    <div>
      <div className={styles.earthInputLabel}>
        {i18nT('walletSendTokens.amount')}{' '}{tokenInfo.symbol}
        {
          <div onClick={() => loadMaxAmount()} className={styles.maxBtn}>
            {i18nT('walletSendTokens.max')}
          </div>
        }
      </div>
      <input
        autoCapitalize="off"
        autoCorrect="off"
        autoFocus={false}
        className={clsx(styles.recipientAddress, styles.earthinput)}
        key={'amount'}
        max="1.00"
        min="0.00"
        onChange={(e) => changeAmount(e.target.value)}
        placeholder={i18nT('walletSendTokens.amountPlace')}
        required
        step="0.001"
        type="number"
        value={selectedAmount}
      />
      {!(error != '') && initialized && !isNaN(price) && (
        <div className={styles.priceInput}>
          ${((selectedAmount + fees) * price).toFixed(2)}
        </div>
      )}
      {error != '' && (
        <div className={styles.amountError}>
          <Warning isBelowInput isDanger>
            {error}
          </Warning>
        </div>
      )}
    </div>
  );
};
export default withRouter(WalletSendTokens);