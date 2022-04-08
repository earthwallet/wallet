import { principalTextoAddress, validateAddress } from "@earthwallet/assets";
import React, { useEffect, useState } from "react";
import ToolTipInfo from "~components/ToolTipInfo";
import Warning from "~components/Warning";
import styles from './index.scss';

const PRINCIPAL_NOT_ACCEPTED = 'Principal id is not accepted!';


interface Props {
    inputType?: string,
    autoFocus?: boolean,
    key?: string,
    placeholder?: string,
    recpCallback: (recipient: string) => void,
    recpErrorCallback: (recipientError: string) => void,
}


export default function AddressInput({
    inputType,
    autoFocus = false,
    key = 'recp',
    placeholder = "Recipient address",
    recpCallback,
    recpErrorCallback
}: Props) {
    console.log(inputType);


    const [selectedRecp, setSelectedRecp] = useState<string>('');
    const [recpError, setRecpError] = useState('');

    useEffect(() => {
        recpCallback(selectedRecp);
    }, [recpCallback, selectedRecp]);

    useEffect(() => {
        recpErrorCallback(recpError);
    }, [recpErrorCallback, recpError]);

    const parseRecipientAndSetAddress = (recipient: string) => {
        if (inputType === 'ICP') {
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

    return <>
        <div className={styles.cont}>
            <div className={styles.info}><ToolTipInfo title={inputType == 'ICP' ? "Account ID is required" : "Address is required"} /></div>
            <input
                autoCapitalize='off'
                autoCorrect='off'
                autoFocus={autoFocus}
                key={key}
                className={styles.earthinput}
                placeholder={placeholder}

                onChange={(e) => parseRecipientAndSetAddress(e.target.value)}
                required
                value={selectedRecp}
            />
            {inputType == 'ICP' && <div className={styles.type}>AID</div>}
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
