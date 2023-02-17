import React, { useState, useEffect, useCallback } from 'react';
import Header from '~components/Header';
import styles from './index.scss';
import clsx from 'clsx';
import NextStepButton from '~components/NextStepButton';
import { canisterAgent, canisterAgentApi, listNFTsExt } from '@earthwallet/assets';

import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { decryptString } from '~utils/vault';
import { selectAccountById, selectAssetsByAddressAndSymbol } from '~state/wallet';
import useQuery from '~hooks/useQuery';
import { isJsonString } from '~utils/common';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { principal_to_address } from '@earthwallet/keyring/build/main/util/icp';
import InputWithLabel from '~components/InputWithLabel';
import Warning from '~components/Warning';
import { useController } from '~hooks/useController';
import { validateMnemonic } from '@earthwallet/keyring';
import { useHistory } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { i18nT } from '~i18n/index';

const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{ accountId: string }> {
}


const ListNFT = ({
    match: {
        params: { accountId },
    },
}: Props) => {

    const history = useHistory();

    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const selectedAccount = useSelector(selectAccountById(accountId));
    const { address, symbol } = selectedAccount;

    const [selectedAsset, setSelectedAsset] = useState<string>('');
    const [selectedAssetObj, setSelectedAssetObj] = useState<keyable>({});
    const [cancelListing, setCancelListing] = useState<boolean>(false);

    const [txCompleteTxt, setTxCompleteTxt] = useState<string>('');

    const assets: keyable = useSelector(selectAssetsByAddressAndSymbol(address, symbol));

    const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.tokenIdentifier === assetId)[0]

    const [txError, setTxError] = useState('');
    const [error, setError] = useState('');
    const [pass, setPass] = useState('');
    const [isBusy, setIsBusy] = useState(false);
    const queryParams = useQuery();
    const [loadingSend, setLoadingSend] = useState<boolean>(false);

    const controller = useController();

    useEffect(() => {
        if (queryParams.get('assetId') === null) {
            setSelectedAsset(selectedAccount?.symbol)
        }
        else {
            setSelectedAsset(queryParams.get('assetId') || '');
            setSelectedAssetObj(getSelectedAsset(queryParams.get('assetId') || ''));
            const existingAmount: number = getSelectedAsset(queryParams.get('assetId') || '')?.forSale ? getSelectedAsset(queryParams.get('assetId') || '').info.price : 0;
            setSelectedAmount(parseFloat((existingAmount / 100000000).toFixed(8)) || 0)
        }
    }, [queryParams.get('assetId') !== null]);

    useEffect(() => {
        if (queryParams.get('cancel') === 'true') {
            setCancelListing(true);
            setSelectedAmount(0);
        }

    }, [queryParams.get('cancel') !== null]);

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
                setError(i18nT('common.wrongPass'));
            }
            if (selectedAccount?.symbol === 'ICP' ? !isJsonString(secret) : !validateMnemonic(secret)) {
                setError(i18nT('common.wrongPass'));
            }
        }
        , [selectedAccount]);

    const listNFT = async () => {

        if (selectedAmount < 0) {
            setError(`Amount cannot be negative.`);
            return;
        }

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


            if (selectedAssetObj?.canisterId === 'ntwio-byaaa-aaaak-qaama-cai') {
                try {
                    const resp = await canisterAgentApi(selectedAssetObj?.canisterId, 'list',
                        {
                            "token": selectedAssetObj?.id,
                            "from_subaccount": [],
                            "price": selectedAmount === 0 ? [] : [BigInt(selectedAmount * Math.pow(10, 8))]
                        },
                        currentIdentity);
                    if (resp.ok === 1) {
                        history.replace(`/nftdetails/${selectedAsset}`);
                        setTxCompleteTxt('Listed');
                        setLoadingSend(false);
                        setIsBusy(false);
                    }
                } catch (error) {
                    console.log(error);
                    setTxError("Please try again later! Error: " + JSON.stringify(error));
                    setLoadingSend(false);
                    setIsBusy(false);
                }
            }
            else if (selectedAssetObj?.type == 'EarthArt') {
                try {
                    await canisterAgent({
                        canisterId: selectedAssetObj?.canisterId,
                        method: 'setApprovalForAll',
                        fromIdentity: currentIdentity,
                        args: {
                            id: { principal: Principal.fromText('vvimt-yaaaa-aaaak-qajga-cai') },
                            approved: true,
                        },
                    });
                    const status = await canisterAgent({
                        canisterId: 'vvimt-yaaaa-aaaak-qajga-cai',
                        method: 'createListing',
                        fromIdentity: currentIdentity,
                        args: {
                            groupIdentifier: [],
                            expiry: [],
                            nft: {
                                nftCanister: Principal.fromText(selectedAssetObj?.canisterId),
                                nftIdentifier: { nat32: selectedAssetObj.tokenIndex },
                            },
                            price: selectedAmount === 0 ? 0 : BigInt(selectedAmount * Math.pow(10, 8)),
                            symbol: { icp: null },
                        },
                    });
                    await controller.assets.fetchListingsByUser(address)
                    if (status.ok != null) {
                        history.replace(`/nftdetails/${selectedAsset}`);
                        setTxCompleteTxt('Listed');
                        setLoadingSend(false);
                        setIsBusy(false);
                    }
                    else {
                        throw (status.err)
                    }
                } catch (error) {
                    console.log(error);
                    setTxError("Please try again later! Error: " + JSON.stringify(error));
                    setLoadingSend(false);
                    setIsBusy(false);
                }
            }
            else {
                try {
                    await listNFTsExt(selectedAssetObj?.canisterId, currentIdentity, selectedAssetObj?.tokenIndex, selectedAmount);
                    //update asset price after list
                    controller.assets.updateTokenDetails({ id: selectedAsset, address, price: selectedAmount }).then(() => {
                        history.replace(`/nftdetails/${selectedAsset}`);
                        setTxCompleteTxt('Listed');
                        setLoadingSend(false);
                        setIsBusy(false);
                    });
                    controller.assets.getICPAssetsOfAccount({ address, symbol: 'ICP' });
                } catch (error) {
                    console.log(error);
                    setTxError("Please try again later! Error: " + JSON.stringify(error));
                    setLoadingSend(false);
                    setIsBusy(false);
                }

            }

        } else {
            setError(i18nT('common.wrongPass'));
            setIsBusy(false);
        }

        return true;
    };

    return <div className={styles.page}>
        <Header
            showBackArrow
            text={selectedAssetObj?.forSale
                ? cancelListing ? i18nT('listNFT.cancel')
                    : i18nT('listNFT.updatePrice')
                : i18nT('listNFT.listNFT')}
            type={'wallet'}
        ><div style={{ width: 39 }} />
        </Header>
        {cancelListing ?

            <div>
                <div className={clsx(styles.info, styles.cancelinfo)}>{i18nT('listNFT.cancelInfo')}</div>
            </div> :
            <div>
                <div className={styles.earthInputLabel}>Price in ICP</div>
                <input
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoFocus={false}
                    className={clsx(styles.recipientAddress, styles.earthinput)}
                    key={'price'}
                    max="1.00"
                    min="0.00"
                    onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
                    placeholder={i18nT('listNFT.placeholder')}
                    required
                    step="0.001"
                    type="number"
                    value={selectedAmount}
                />
                <div className={styles.info}>{i18nT('listNFT.info')}</div>
            </div>}

        <div
            className={styles.passwordCont}
        >
            <InputWithLabel
                data-export-password
                disabled={isBusy}
                isError={pass.length < MIN_LENGTH || !!error}
                label={i18nT('common.passwordForAc')}
                onChange={onPassChange}
                placeholder={i18nT('common.requiredPlaceholder')}
                type='password'
            />
            {error && (<div
            >
                <Warning
                    isBelowInput
                    isDanger
                >
                    {error}
                </Warning></div>
            )}
        </div>
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
        <div className={styles.nextCont}>
            <NextStepButton
                disabled={loadingSend || !!error || pass.length < MIN_LENGTH || !(txCompleteTxt === undefined || txCompleteTxt === '')}
                loading={isBusy || loadingSend}
                onClick={() => listNFT()}
            >
                {
                    selectedAssetObj?.forSale
                        ? cancelListing
                            ? i18nT('listNFT.cancel')
                            : i18nT('listNFT.updateBtn')
                        : i18nT('listNFT.listBtn')
                }
            </NextStepButton>
        </div>
    </div>;
};

export default withRouter(ListNFT);
