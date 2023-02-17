
import React, { useState } from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectInfoBySymbolOrToken, selectTokenInfoByContract } from '~state/tokens';
import NextStepButton from '~components/NextStepButton';
import { keyable } from '~scripts/Background/types/IMainController';
// @ts-ignore
import ICON_ROCKETPOOL from '~assets/images/icon_rocketpool.jpg';
import millify from 'millify';
import { ROCKETPOOL_CONTRACT_ADDR } from '~global/tokens';
import { selectAccountById, selectBalanceByAccountId } from '~state/wallet';
import { useHistory } from 'react-router-dom';
import { debounce } from "lodash";
import { swapFromReth, swapToReth } from '~utils/uniswap';
import { i18nT } from '~i18n/index';

const UNISWAP_MAX_ETH = 0.01;

interface Props extends RouteComponentProps<{ accountId: string }> {
}


const StakeEth = ({
  match: {
    params: { accountId },
  },
}: Props) => {
  const history = useHistory();

  const [overSecond, setOverSecond] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const [tab, setTab] = useState<number>(0);
  const [error, setError] = useState<any>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<keyable>({});
  const rETHInfo = useSelector(selectInfoBySymbolOrToken(ROCKETPOOL_CONTRACT_ADDR, accountId));
  const rETHTokenInfo = useSelector(selectTokenInfoByContract(ROCKETPOOL_CONTRACT_ADDR));

  const selectedAccount = useSelector(selectAccountById(accountId));

  const { address, symbol } = selectedAccount || {};

  const currentBalance: keyable = useSelector(
    selectBalanceByAccountId(accountId)
  );

  const maxAmountSpend = () => {
    if (tab == 0) {
      const existingBalance = (currentBalance?.value || 0) /
        Math.pow(10, currentBalance?.currency?.decimals || 0);
      let maxSpend;
      if (existingBalance == 0) {
        maxSpend = 0;
      } else {
        maxSpend = existingBalance - UNISWAP_MAX_ETH;
      }
      setSelectedAmount(maxSpend);
    } else if (tab == 1) {
      setSelectedAmount(rETHInfo?.balance);
    }
  }

  const nextScreen = () => {
    history.push(`/stakeconfirm_eth/${accountId}?params=${JSON.stringify(params)}`);
  }

  const fetchData = async (selectedAmount: number, _tab: number, cb: (arg0: { error: unknown; success: boolean; info: string; uniswap?: undefined; } | { success: boolean; error: string; info?: undefined; uniswap?: undefined; } | { uniswap: keyable; success: boolean; error?: undefined; info?: undefined; }) => void) => {

    let res
    if (_tab == 0) {
      res = await swapToReth(address, selectedAmount.toString(), 'RETH');

    } else {
      res = await swapFromReth(address, selectedAmount.toString(), 'ETH');

    }
    cb(res);
  };

  const debouncedFetchData = debounce((selectedAmount, _tab, cb) => {
    fetchData(selectedAmount, _tab, cb);
  }, 500);

  React.useEffect(() => {
    if (!(selectedAmount == 0 || Number.isNaN(selectedAmount))) {
      setLoading(true);
      debouncedFetchData(selectedAmount, tab, (res: any) => {
        setLoading(false);
        if (tab == 0) {
          if (res?.uniswap?.inputAmount > (currentBalance?.value || 0) /
            Math.pow(10, currentBalance?.currency?.decimals || 0)
          ) {
            setError('Insufficient ETH Balance.')
          } else {
            setError('');
          }
        } else if (tab == 1) {
          if (res?.uniswap?.inputAmount > (rETHInfo?.balance || 0)
          ) {
            setError('Insufficient rETH Balance.')
          } else {
            setError('');
          }
        }

        setParams(res);
      });
    }
  }, [selectedAmount, tab]);

  const setTabWithAmount = (tab: number) => {
    setTab(tab);
    setSelectedAmount(0);
    setError('');
    setLoading(false);

  }
  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={'Stake ETH'}
      ><div className={styles.empty} /></Header>

      <div className={styles.tabs}>
        <div
          onClick={() => setTabWithAmount(0)}
          className={clsx(styles.tab, tab === 0 && styles.tab_active)}>
          {i18nT('stakeEth.stake')}
        </div>
        <div
          onClick={() => setTabWithAmount(1)}
          className={clsx(styles.tab, tab === 1 && styles.tab_active)}>
          {i18nT('stakeEth.claimRewards')}
        </div>
      </div>
      <div className={styles.tabcont}>
        <div className={styles.tabText}>{i18nT('stakeEth.info')}</div>
        <div className={styles.labelCont}>
          <div className={styles.tokenStats}>
            <div className={styles.tokenLabel}>Available to {tab === 0 ? 'Stake' : 'Unstake'}:</div>
            {tab == 0 ? <div className={styles.tabStats}>{(
              (currentBalance?.value || 0) /
              Math.pow(10, currentBalance?.currency?.decimals || 0)
            ).toFixed(4)}{" "}
              {symbol}</div> : <div className={styles.tabStats}>{rETHInfo?.balance?.toFixed(5) || 0}{" "}
              {rETHInfo?.symbol}</div>}
          </div>
          <div
            onClick={() => maxAmountSpend()}
            className={styles.maxBtn}>{i18nT('stakeEth.max')}</div>
        </div>
        <div className={clsx(styles.inputCont, overSecond && styles.inputCont_active)}>
          <input
            onMouseOver={() => setOverSecond(true)}
            onMouseOut={() => setOverSecond(false)}
            autoCapitalize='off'
            autoCorrect='off'
            autoFocus={true}
            key={'price'}
            min="0.00"
            onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
            placeholder="8 decimal"
            required
            step="0.001"
            type="number"
            value={selectedAmount}
            className={styles.einput}></input>
          <div className={styles.tokenInfoCont}>
            <img className={styles.tokenicon} src={ICON_ROCKETPOOL} ></img>
            <div className={styles.tokename}>Rocket Pool</div>
          </div>
        </div>
      </div>
      {error == '' ? params?.success == true && <div className={styles.fees}>Fees: ${typeof params?.uniswap?.estimatedGasUsedUSDTxt == 'string' ? parseFloat(params?.uniswap?.estimatedGasUsedUSDTxt).toFixed(2) : params?.uniswap?.estimatedGasUsedUSDTxt.toFixed(2)}</div> : <div style={{ opacity: 0.8 }} className={styles.fees}>{error}</div>}
      <div className={styles.stats}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.key}>{i18nT('stakeEth.yourStake')}</div>
            <div className={styles.val}>{rETHInfo?.balanceTxt || '0.0'} {rETHInfo?.symbol}</div>
          </div>
          {<div className={styles.col}>
            <div className={styles.key}>{i18nT('stakeEth.stakingRewards')}</div>
            <div className={styles.val}>{parseFloat(rETHTokenInfo?.yearlyAPR || 3.6).toFixed(2)}% APR</div>
          </div>}
        </div>
        {<div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.key}>{i18nT('stakeEth.total')}</div>
            <div className={styles.val}> {millify(parseInt(rETHTokenInfo?.ethStakingTotal || '218656'), {
              precision: 2,
              lowercase: false,
            })} ETH</div>
          </div>
          {<div className={styles.col}>
            <div className={styles.key}>{i18nT('stakeEth.validatorFee')}</div>
            <div className={styles.val}>15%</div>
          </div>}
        </div>}
      </div>

      <div className={styles.nextCont}>
        <NextStepButton
          disabled={Number.isNaN(selectedAmount) || selectedAmount == 0 || error != '' || params?.uniswap?.estimatedGasUsedUSDTxt == undefined || (params?.uniswap?.inputAmount != selectedAmount?.toString())}
          loading={loading || ((Number.isNaN(selectedAmount) || selectedAmount == 0) ? false : params?.uniswap?.inputAmount != selectedAmount?.toString())}
          onClick={() => nextScreen()}
        >
          {tab === 0 ? i18nT('stakeEth.stake') : i18nT('stakeEth.unstake')}
        </NextStepButton>
      </div>
    </div>
  );
};

export default withRouter(StakeEth);