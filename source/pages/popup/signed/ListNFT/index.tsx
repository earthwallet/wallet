import React, { useState, useEffect, useCallback } from 'react';
import Header from '~components/Header';
import styles from './index.scss';
import clsx from 'clsx';
import NextStepButton from '~components/NextStepButton';
import { listNFTsExt } from '@earthwallet/assets';

import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { decryptString } from '~utils/vault';
import { selectAccountById, selectAssetsICPByAddress } from '~state/wallet';
import useQuery from '~hooks/useQuery';
import { isJsonString } from '~utils/common';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { principal_to_address } from '@earthwallet/keyring/build/main/util/icp';
import InputWithLabel from '~components/InputWithLabel';
import Warning from '~components/Warning';
import { useController } from '~hooks/useController';
import { validateMnemonic } from '@earthwallet/keyring';
import { useHistory } from 'react-router-dom';

const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{ address: string }> {
}


const ListNFT = ({
    match: {
        params: { address },
    },
}: Props) => {

    const history = useHistory();

    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const selectedAccount = useSelector(selectAccountById(address));
    const [selectedAsset, setSelectedAsset] = useState<string>('');
    const [selectedAssetObj, setSelectedAssetObj] = useState<keyable>({});
    const [txCompleteTxt, setTxCompleteTxt] = useState<string>('');

    const assets: keyable = useSelector(selectAssetsICPByAddress(address));

    const getSelectedAsset = (assetId: string) => assets.filter((asset: keyable) => asset.tokenIdentifier === assetId)[0]

    const [txError, setTxError] = useState('');
    const [error, setError] = useState('');
    const [pass, setPass] = useState('');
    const [isBusy, setIsBusy] = useState(false);
    const queryParams = useQuery();
    const [loadingSend, setLoadingSend] = useState<boolean>(false);

    const controller = useController();

    useEffect(() => {
        if (queryParams.get('assetid') === null) {
            setSelectedAsset(selectedAccount?.symbol)
        }
        else {
            setSelectedAsset(queryParams.get('assetid') || '');
            setSelectedAssetObj(getSelectedAsset(queryParams.get('assetid') || ''));
            const existingAmount: number = getSelectedAsset(queryParams.get('assetid') || '')?.forSale ? getSelectedAsset(queryParams.get('assetid') || '').info.price : 0;
            setSelectedAmount(parseFloat((existingAmount / 100000000).toFixed(8)) || 0)
        }
    }, [queryParams.get('assetid') !== null]);

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

    const listNFT = async () => {

        if (selectedAmount <= 0) {
            setError(`Amount cannot be negative.`);
            return;
        }

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

        } else {
            setError('Wrong password! Please try again');
            setIsBusy(false);
        }

        return true;
    };

    return <div className={styles.page}>
        <Header
            showBackArrow
            text={selectedAssetObj?.forSale
                ? 'Update Price for Public Sale'
                : 'List NFT for Public sale'}
            type={'wallet'}
        ><div style={{ width: 39 }} />
        </Header>
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
                placeholder="price up to 8 decimal places"
                required
                step="0.001"
                type="number"
                value={selectedAmount}
            />
        </div>
        <div className={styles.info}>Enter a price upto 8 decimal places for public sale. Listing is free and on sale of NFT, 2.0% of the amount will be deducted towards 1.0% Creators Royalty fee,
            and a 1% Network Marketplace fee</div>
        <div
            className={styles.passwordCont}
        >
            <InputWithLabel
                data-export-password
                disabled={isBusy}
                isError={pass.length < MIN_LENGTH || !!error}
                label={'password for this account'}
                onChange={onPassChange}
                placeholder='REQUIRED'
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
                {selectedAssetObj?.forSale ? 'Update Price' : 'List for Public Sale'}
            </NextStepButton>
        </div>
    </div>;
};

export default withRouter(ListNFT);
