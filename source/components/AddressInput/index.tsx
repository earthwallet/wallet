import { principalTextoAddress, validateAddress, validatePrincipal } from "@earthwallet/assets";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import ToolTipInfo from "~components/ToolTipInfo";
import Warning from "~components/Warning";
import { getTokenInfo } from "~global/tokens";
import styles from './index.scss';

const PRINCIPAL_NOT_ACCEPTED = 'Principal id is not accepted!';


interface Props {
    inputType?: string,
    autoFocus?: boolean,
    key?: string,
    placeholder?: string,
    recpCallback: (recipient: string) => void,
    recpErrorCallback: (recipientError: string) => void,
    initialValue?: string,
    tokenId?: string | null
}


export default function AddressInput({
    inputType,
    autoFocus = false,
    key = 'recp',
    recpCallback,
    recpErrorCallback,
    initialValue = '',
    tokenId
}: Props) {


    const [selectedRecp, setSelectedRecp] = useState<string>(initialValue);
    const [recpError, setRecpError] = useState('');
    const tokenInfo = getTokenInfo(tokenId || '');

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

                }
                else {
                    setRecpError('Not a valid principal id');
                }
            }
            else {
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

        }
        else {
            setSelectedRecp(recipient);
        }
    };

    const togglePrincipal = () => {
        setSelectedRecp(recipient => principalTextoAddress(recipient));
        setRecpError('');
    }

    return <>
        <div className={styles.cont}>
            <div className={styles.info}><ToolTipInfo title={inputType == 'ICP' ? tokenInfo?.addressType == 'principal' ? 'Principal Id is required' : "Account ID is required" : "Address is required"} /></div>
            <input
                autoCapitalize='off'
                autoCorrect='off'
                autoFocus={autoFocus}
                key={key}
                className={clsx(styles.earthinput, tokenInfo?.addressType == 'principal' && styles.earthinput_princ)}
                placeholder={inputType == 'ICP' ? tokenInfo?.addressType == 'principal' ? 'Principal Id' : 'Account ID' : "Recipient address"}
                onChange={(e) => parseRecipientAndSetAddress(e.target.value)}
                required
                value={selectedRecp}
            />
            {inputType == 'ICP' && tokenInfo?.addressType == 'principal' ? <div className={styles.type}>PRINC</div> : <div className={styles.type}>AID</div>}
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
