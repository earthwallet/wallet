


import React, { useEffect, useState } from 'react';
import styles from './index.scss';

import clsx from 'clsx';
import ICON_EARTH from '~assets/images/icon-512.png';
import { useSelector } from 'react-redux';
import { selectTokenByTokenPair } from '~state/token';
import { keyable } from '~scripts/Background/types/IMainController';
//import { mint } from '@earthwallet/assets';
import ICON_CARET from '~assets/images/icon_caret.svg';

export const TokenSelectorDropdown = ({
    filterTokenId,
    tokenInfo,
    tokenInfos,
    setSelectedAmount,
    selectedAmount,
    setSelectedToken,
    selectedToken,
    address
}: {
    filterTokenId?: string,
    tokenInfos: keyable,
    tokenInfo: keyable,
    setSelectedAmount: any,
    selectedAmount: any,
    setSelectedToken: any,
    selectedToken: any,
    address: string
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [overSecond, setOverSecond] = React.useState(false);
    useEffect(() => {
        setSelectedToken({ symbol: tokenInfo?.symbol, id: tokenInfo?.id })
    }, [tokenInfo !== null]);
    return <div className={styles.dropdownCont}>
        {(selectedToken?.id == "" || selectedToken?.id == null)
            ? <div>
                <div
                    onClick={() => setOpen(!open)}
                    className={clsx(styles.sinput, styles.selectDropdown)}>
                    <div className={styles.noicon}></div>
                    <div className={styles.label}>Select an asset</div>
                    <img className={styles.careticon} src={ICON_CARET} />
                </div>
            </div>
            : <div className={clsx(styles.sinput, overSecond && styles.sinput_active)}>
                <div
                    onClick={() => setOpen(!open)}
                    className={styles.econt}>
                    {tokenInfo.icon ? <img className={styles.eicon} src={ICON_EARTH}></img> : <div className={styles.eicon}>{selectedToken?.symbol?.charAt(0)}</div>}
                    <div>{selectedToken?.symbol}</div>
                    <img className={styles.careticon} src={ICON_CARET} />
                </div>
                <div className={styles.econtinput}>
                    <div className={styles.maxBtn}>Max</div>
                    <input
                        onMouseOver={() => setOverSecond(true)}
                        onMouseOut={() => setOverSecond(false)}
                        autoCapitalize='off'
                        autoCorrect='off'
                        autoFocus={false}
                        key={'price'}
                        max="1.00"
                        min="0.00"
                        onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
                        placeholder="8 decimal"
                        required
                        step="0.001"
                        type="number"
                        value={selectedAmount}
                        className={styles.einput}></input>
                    <div className={styles.balanceData}><span className={styles.balanceLabel}>Balance:</span><div className={styles.balanceText}><TokenBalance address={address} selectedToken={selectedToken} /></div></div>
                </div>
            </div>}
        {open && <div className={styles.tokenOptions}>
            {tokenInfos.filter((token: keyable) => token?.id !== filterTokenId).map((token: keyable) => <div
                onClick={() => {
                    setSelectedToken({
                        symbol: token?.symbol,
                        id: token?.id
                    });
                    setOpen(false);
                }}
                key={token?.id}
                className={clsx(styles.sinput, styles.selectDropdown, styles.selectDropdownOption)}>
                <div className={styles.noicon} ></div>
                <div className={styles.label}>{token?.symbol}</div>
            </div>)}
        </div>}
    </div>
}

export const TokenBalance = ({ selectedToken, address }: { selectedToken: keyable, address: string }) => {
    const tokenPair = useSelector(selectTokenByTokenPair(address + "_WITH_" + selectedToken?.id));

    return <div className={styles.tokenBalance}>
        {selectedToken?.symbol == "" ? "-" : tokenPair?.balance} {selectedToken?.symbol}
    </div>
}

export default TokenSelectorDropdown;