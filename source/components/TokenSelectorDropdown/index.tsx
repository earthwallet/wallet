import React, { useEffect, useState } from 'react';
import styles from './index.scss';

import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectTokenByTokenPair } from '~state/tokens';
import { keyable } from '~scripts/Background/types/IMainController';
import ICON_CARET from '~assets/images/icon_caret.svg';
import { selectBalanceById } from '~state/wallet';

export const TokenSelectorDropdown = ({
    filterTokenId,
    tokenInfo,
    tokenInfos,
    setSelectedAmount,
    selectedAmount,
    setSelectedToken,
    selectedToken,
    address,
    loading,
    hideMax,
    noDropdown
}: {
    filterTokenId?: string,
    tokenInfos: keyable,
    tokenInfo: keyable,
    setSelectedAmount: any,
    selectedAmount: any,
    setSelectedToken: any,
    selectedToken: any,
    address: string,
    loading?: boolean,
    hideMax?: boolean,
    noDropdown?: boolean
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [overSecond, setOverSecond] = React.useState(false);
    const [balance, setBalance] = React.useState<number | string>(0);

    const maxBalance = () => {
        setSelectedAmount(typeof balance == 'string' ? parseFloat(balance) : balance);
    };

    useEffect(() => {
        setSelectedToken({ icon: tokenInfo?.icon, symbol: tokenInfo?.symbol, id: tokenInfo?.id })
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
                    onClick={() => noDropdown ? console.log() : setOpen(!open)}
                    className={styles.econt}>
                    {selectedToken?.icon ? <img className={styles.eicon} src={selectedToken?.icon}></img> : <div className={styles.eicon}>{selectedToken?.symbol?.charAt(0)}</div>}
                    <div>{selectedToken?.symbol}</div>
                    {!noDropdown && <img className={styles.careticon} src={ICON_CARET} />}
                </div>
                <div className={styles.econtinput}>
                    {!hideMax && <div
                        onClick={() => maxBalance()}
                        className={clsx(styles.maxBtn, loading && styles.maxBtn_loading)}>Max</div>}
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
                    <div className={styles.balanceData}><span className={styles.balanceLabel}>Balance: </span><div className={styles.balanceText}>
                        {selectedToken?.symbol == 'ICP' ? <ICPBalance
                            setBalance={setBalance}
                            address={address} /> : <TokenBalance
                            setBalance={setBalance}
                            address={address} selectedToken={selectedToken} />}
                    </div>
                    </div>
                </div>
            </div>}
        {open && <div className={styles.tokenOptions}>
            {tokenInfos.filter((token: keyable) => token?.id !== filterTokenId).map((token: keyable) => <div
                onClick={() => {
                    setSelectedToken({
                        symbol: token?.symbol,
                        id: token?.id,
                        icon: token?.icon
                    });
                    setOpen(false);
                }}
                key={token?.id}
                className={clsx(styles.sinput, styles.selectDropdown, styles.selectDropdownOption)}>
                <div className={styles.noicon}>{token?.icon ? <img className={styles.eicon} src={token?.icon}></img> : <div></div>}</div>
                <div className={styles.label}>{token?.symbol}</div>
            </div>)}
        </div>}
    </div>
}

export const TokenBalance = ({ selectedToken, address, setBalance }: { selectedToken: keyable, address: string, setBalance: (balance: string | number) => void }) => {
    const tokenPair = useSelector(selectTokenByTokenPair(address + "_WITH_" + selectedToken?.id));

    useEffect(() => {
        setBalance(tokenPair?.balanceTxt)
    }, [tokenPair?.balanceTxt !== null]);

    return <div className={styles.tokenBalance}>
        {selectedToken?.symbol == "" ? "-" : tokenPair?.balanceTxt} {selectedToken?.symbol}
    </div>
}

const ICPBalance = ({ address, setBalance }: { address: string, setBalance: (balance: string | number) => void }) => {
    const currentBalance: keyable = useSelector(selectBalanceById(address));

    useEffect(() => {
        setBalance((currentBalance?.value || 0) / Math.pow(10, currentBalance?.currency?.decimals || 0))
    }, []);

    return <div>{(currentBalance?.value || 0) / Math.pow(10, currentBalance?.currency?.decimals || 0)} {"ICP"}</div>
}

export default TokenSelectorDropdown;
