
import React, { useEffect, useState } from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, withRouter } from 'react-router';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectTokenByTokenPair, selectTokensInfo, selectTokensInfoById } from '~state/tokens';
import NextStepButton from '~components/NextStepButton';
import { keyable } from '~scripts/Background/types/IMainController';
import { useController } from '~hooks/useController';
import useToast from '~hooks/useToast';
import ICON_STAKE from '~assets/images/th/stake.svg';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import TokenSelectorDropdown from '~components/TokenSelectorDropdown';
import { i18nT } from '~i18n/index';
interface Props extends RouteComponentProps<{ address: string, tokenId: string }> {
}


const Stake = ({
  match: {
    params: { address, tokenId },
  },
}: Props) => {

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<keyable>({ symbol: "", id: "" });
  const [selectedSecondAmount, setSelectedSecondAmount] = useState<number>(0);
  const [selectedSecondToken, setSelectedSecondToken] = useState<keyable>({ symbol: "", id: "" });

  const [tab, setTab] = useState<number>(0);
  const tokenInfo = useSelector(selectTokensInfoById(tokenId));
  const tokenInfos = useSelector(selectTokensInfo);
  const controller = useController();
  const [pairRatio, setPairRatio] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [priceFetch, setPriceFetch] = useState<boolean>(false);
  const { show } = useToast();

  useEffect((): void => {
    if ((selectedToken.id != "") && selectedSecondToken.id != "" && selectedSecondToken.id != null) {

      setPriceFetch(true);
      controller.tokens.getPair(selectedToken.id, selectedSecondToken.id).then((response) => {
        setPairRatio(response.ratio);
        setPriceFetch(false);
      });
    }
  }, [selectedToken.id, selectedSecondToken.id]);

  const stake = async () => {
    setLoading(true);
    const response = await controller.tokens.stake(selectedToken.id, selectedSecondToken.id, selectedAmount);
    setPairRatio(response.ratio);
    show(i18nT('stake.complete'));
    await controller.tokens.getTokenBalances(address);
    show(i18nT('stake.done'));
    setLoading(false);

  }

  const updateAmount = (amount: number) => {
    if (selectedSecondToken?.id == null) {
      show(i18nT('stake.selectSecond'));
      return;
    }
    setSelectedAmount(amount);
    setSelectedSecondAmount(Number((pairRatio * amount)?.toFixed(3)));
  }
  const updateSecondAmount = (amount: number) => {
    if (pairRatio != 0) {
      let selectedAmount: number = amount / pairRatio;
      setSelectedAmount(Number(selectedAmount?.toFixed(3)));
      setSelectedSecondAmount(amount);
    }
    else {
      setSelectedSecondAmount(amount);
    }

  }
  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={'Stake ' + selectedToken.symbol}
      ><div className={styles.empty} /></Header>

      <div className={styles.tabs}>
        <div
          onClick={() => setTab(0)}
          className={clsx(styles.tab, tab === 0 && styles.tab_active)}>
          {i18nT('stake.add')}
        </div>
        <div
          onClick={() => setTab(1)}
          className={clsx(styles.tab, tab === 1 && styles.tab_active)}>
          {i18nT('stake.stake')}
        </div>
      </div>
      <div className={styles.tabcont}>
        <div className={styles.firstInputCont}>
          <TokenSelectorDropdown
            loading={priceFetch}
            tokenInfo={tokenInfo}
            tokenInfos={tokenInfos}
            filterTokenId={tokenId}
            setSelectedAmount={updateAmount}
            selectedAmount={selectedAmount}
            setSelectedToken={setSelectedToken}
            selectedToken={selectedToken}
            address={address}
          />
          <div className={styles.swapbtn}><img src={ICON_STAKE} /></div>
        </div>
        <TokenSelectorDropdown
          tokenInfo={{}}
          loading={priceFetch}
          tokenInfos={tokenInfos}
          filterTokenId={tokenId}
          setSelectedAmount={updateSecondAmount}
          selectedAmount={selectedSecondAmount}
          setSelectedToken={setSelectedSecondToken}
          selectedToken={selectedSecondToken}
          address={address}
        />

      </div>
      <div className={styles.statsCont}>
        <div className={styles.statsCol}>
          <div className={styles.statKey}>
            {i18nT('stake.fees')}
          </div>
          <div className={styles.statVal}>
            1%
          </div>
        </div>
        <div className={styles.statsCol}>
          <div className={styles.statKey}>
            {i18nT('stake.price')}
          </div>
          <div className={styles.statVal}>
            {priceFetch
              ? <SkeletonTheme color="#a5acbb36" highlightColor="#eee">
                <Skeleton width={60} />
              </SkeletonTheme>
              : selectedToken.symbol == ""
                ? "-"
                : pairRatio?.toFixed(3)
            }
          </div>
          <div className={styles.statKey}>
            {selectedToken.symbol}/{selectedSecondToken.symbol || "?"}
          </div>
        </div>
        <div className={styles.statsCol}>
          <div className={styles.statKey}>
            LP Share
          </div>
          <div className={styles.statVal}>
            2%
          </div>
        </div>
      </div>

      <div className={styles.nextCont}>
        <NextStepButton
          disabled={selectedAmount == 0}
          loading={loading}
          onClick={() => stake()}
        >
          {i18nT('stake.cta')}
        </NextStepButton>
      </div>
    </div>
  );
};


export const SecondTokenInfo = ({ selectedToken, address }: { selectedToken: keyable, address: string }) => {
  const tokenPair = useSelector(selectTokenByTokenPair(address + "_WITH_" + selectedToken.id));

  return <div className={styles.inforow}>
    <div className={styles.infocolleft}>
      <div className={styles.eicon}>{selectedToken.symbol == "" ? "?" : selectedToken.symbol?.charAt(0)}
      </div>
      <div className={styles.symbol}>{selectedToken.symbol == "" ? "-" : selectedToken.symbol}</div>
    </div>
    <div className={styles.infocolright}>{selectedToken.symbol == "" ? "-" : tokenPair?.balance}</div>
  </div>
}

export default withRouter(Stake);