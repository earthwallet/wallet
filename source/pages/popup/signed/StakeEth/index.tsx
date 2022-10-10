
import React, { useState } from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectInfoBySymbolOrToken, selectTokenInfoByContract, selectTokensInfo } from '~state/tokens';
import NextStepButton from '~components/NextStepButton';
import { keyable } from '~scripts/Background/types/IMainController';
import { useController } from '~hooks/useController';
import useToast from '~hooks/useToast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// @ts-ignore
import ICON_ROCKETPOOL from '~assets/images/icon_rocketpool.jpg';
import millify from 'millify';
import { ROCKETPOOL_CONTRACT_ADDR } from '~global/tokens';
import { selectAccountById, selectBalanceByAccountId } from '~state/wallet';

const UNISWAP_MAX_ETH = 0.01;

interface Props extends RouteComponentProps<{ accountId: string }> {
}


const StakeEth = ({
  match: {
    params: { accountId },
  },
}: Props) => {

  const [overSecond, setOverSecond] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const [tab, setTab] = useState<number>(0);
  const tokenInfos = useSelector(selectTokensInfo);
  const controller = useController();

  const [loading, setLoading] = useState<boolean>(false);
  const [priceFetch, setPriceFetch] = useState<boolean>(false);
  const { show } = useToast();
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
    //navigation.push("StakeConfirmScreen", { selectedAmount, accountId, uniswap: activeHeading == "Stake" ? swapToRethReqData?.uniswap : swapFromRethReqData?.uniswap });
  }

  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={'Stake ETH'}
      ><div className={styles.empty} /></Header>

      <div className={styles.tabs}>
        <div
          onClick={() => setTab(0)}
          className={clsx(styles.tab, tab === 0 && styles.tab_active)}>
          Stake
        </div>
        <div
          onClick={() => setTab(1)}
          className={clsx(styles.tab, tab === 1 && styles.tab_active)}>
          Claim Rewards
        </div>
      </div>
      <div className={styles.tabcont}>
        <div className={styles.tabText}>The Ethereum network rewards stakers for helping secure the blockchain. By staking ETH, you can earn up to 5% APY risk free from your self custody wallet.</div>
        <div className={styles.labelCont}>
          <div className={styles.tokenStats}>
            <div className={styles.tokenLabel}>Available to {tab === 0 ? 'Stake' : 'Unstake'}:</div>
            {tab == 0 ? <div className={styles.tabStats}>{(
              (currentBalance?.value || 0) /
              Math.pow(10, currentBalance?.currency?.decimals || 0)
            ).toFixed(4)}{" "}
              {symbol}</div> : <div className={styles.tabStats}>{rETHInfo?.balance?.toFixed(5) || 0}{" "}
              {rETHInfo?.symbol}{'rETH'}</div>}
          </div>
          <div
            onClick={() => maxAmountSpend()}
            className={styles.maxBtn}>Max</div>
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
      <div className={styles.stats}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.key}>Your Stake</div>
            <div className={styles.val}>{rETHInfo?.balanceTxt || '0.0'} {rETHInfo?.symbol}</div>
          </div>
          {<div className={styles.col}>
            <div className={styles.key}>Staking Rewards</div>
            <div className={styles.val}>{parseFloat(rETHTokenInfo?.yearlyAPR || 3.6).toFixed(2)}% APR</div>
          </div>}
        </div>


        {<div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.key}>Total Staked</div>
            <div className={styles.val}> {millify(parseInt(rETHTokenInfo?.ethStakingTotal || '218656'), {
              precision: 2,
              lowercase: false,
            })} ETH</div>
          </div>
          {<div className={styles.col}>
            <div className={styles.key}>Validator Fee</div>
            <div className={styles.val}>15%</div>
          </div>}
        </div>}
      </div>

      <div className={styles.nextCont}>
        <NextStepButton
          disabled={selectedAmount == 0}
          loading={loading}
          onClick={() => nextScreen()}
        >
          {tab === 0 ? 'Stake' : 'Unstake'}
        </NextStepButton>
      </div>
    </div>
  );
};

export default withRouter(StakeEth);