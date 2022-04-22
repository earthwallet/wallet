import { principalTextoAddress, validateAddress, validatePrincipal } from "@earthwallet/assets";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import ToolTipInfo from "~components/ToolTipInfo";
import Warning from "~components/Warning";
import { getTokenInfo } from "~global/tokens";
import styles from './index.scss';
import ICON_SEARCH from '~assets/images/icon_search.svg';
import ICON_VALID_ADDRESS from '~assets/images/icon_valid_address.svg';

import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { validate } from 'bitcoin-address-validation';

const PRINCIPAL_NOT_ACCEPTED = 'Principal id is not accepted!';


interface Props {
    inputType?: string,
    autoFocus?: boolean,
    key?: string,
    placeholder?: string,
    recpCallback: (recipient: string) => void,
    recpErrorCallback: (recipientError: string) => void,
    initialValue?: string,
    tokenId?: string | null,
    search?: boolean
}


export default function AddressInput({
    inputType,
    autoFocus = false,
    key = 'recp',
    recpCallback,
    recpErrorCallback,
    initialValue,
    tokenId,
    search = false
}: Props) {


    const [selectedRecp, setSelectedRecp] = useState<string>('');
    const [valid, setValid] = useState<boolean>(false);

    const [recpError, setRecpError] = useState('');
    const tokenInfo = getTokenInfo(tokenId || '');
    const history = useHistory();
    const location = useLocation();


    useEffect(() => {
        if (initialValue != '' && initialValue != undefined) {
            parseRecipientAndSetAddress(initialValue);
        }
    }, [(initialValue != '' && initialValue != undefined), inputType, tokenInfo?.addressType]);

    const replaceQuery = (
        key: string,
        value: string,
    ) => {
        let searchParams = new URLSearchParams(location.search);
        searchParams.set(key, value);
        history.push({
            pathname: location.pathname.replace('send', 'confirmsend'),
            search: searchParams.toString(),
        });
    };

    useEffect(() => {
        recpCallback(selectedRecp);
    }, [recpCallback, selectedRecp]);

    useEffect(() => {
        recpErrorCallback(recpError);
    }, [recpErrorCallback, recpError]);

    const parseRecipientAndSetAddress = (recipient: string) => {
        if (inputType === 'ICP') {
            setSelectedRecp(recipient);
            if (tokenInfo?.addressType == 'principal') {
                if (validatePrincipal(recipient)) {
                    setRecpError('');
                    setValid(true);

                    search && replaceQuery('recipient', recipient);
                }
                else {
                    setValid(false);
                    setRecpError('Not a valid principal id');
                }
            }
            else {
                if (validateAddress(recipient)) {
                    setRecpError('');
                    setValid(true);

                    search && replaceQuery('recipient', recipient);
                }
                else {
                    const dashCount = (recipient.match(/-/g) || []).length;
                    if (dashCount === 5 || dashCount === 10) {
                        setRecpError(PRINCIPAL_NOT_ACCEPTED)
                    }
                    else {
                        setRecpError('Not a valid address');
                    }
                    setValid(false);

                }
            }

        }
        else if (inputType === 'BTC') {
            setSelectedRecp(recipient);
            if (validate(recipient)) {
                setRecpError('');
                setValid(true);
                search && replaceQuery('recipient', recipient);
            }
            else {
                setValid(false);
                setRecpError('Not a valid btc address');
            }
        }
    };

    const togglePrincipal = () => {
        parseRecipientAndSetAddress(principalTextoAddress(selectedRecp));
    }

    return <>
        <div className={styles.cont}>
            {search ? <img className={styles.info_search} src={ICON_SEARCH} /> : valid ? <img src={ICON_VALID_ADDRESS} className={styles.info_search} /> : <div className={styles.info}><ToolTipInfo title={inputType == 'ICP' ? tokenInfo?.addressType == 'principal' ? 'Principal Id is required' : "Account ID is required" : "Address is required"} /></div>}
            {search ?
                <input
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoFocus={autoFocus}
                    key={key}
                    className={clsx(styles.earthinput, tokenInfo?.addressType == 'principal' && styles.earthinput_princ)}
                    placeholder={inputType == 'ICP' ? tokenInfo?.addressType == 'principal' ? 'Search Principal Id' : 'Search Account ID' : "Search Recipient address"}
                    onChange={(e) => parseRecipientAndSetAddress(e.target.value)}
                    required
                    value={selectedRecp}
                />
                : <input
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoFocus={autoFocus}
                    key={key}
                    className={clsx(styles.earthinput, tokenInfo?.addressType == 'principal' && styles.earthinput_princ)}
                    placeholder={inputType == 'ICP' ? tokenInfo?.addressType == 'principal' ? 'Principal Id' : 'Account ID' : "Recipient address"}
                    onChange={(e) => parseRecipientAndSetAddress(e.target.value)}
                    required
                    value={selectedRecp}
                />}
            {inputType == 'BTC' ? <div className={styles.type}>BTC</div> : inputType == 'ICP' && tokenInfo?.addressType == 'principal' ? <div className={styles.type}>PRINC</div> : <div className={styles.type}>AID</div>}
        </div>
        {recpError !== '' && <Warning
            isBelowInput
            isDanger
            className={styles.warningRecp}
        >
            {recpError} {recpError === PRINCIPAL_NOT_ACCEPTED && <div
                onClick={() => togglePrincipal()}
                className={styles.earthLink}>Click here to change principal id to address</div>}
        </Warning>}
    </>;
}
