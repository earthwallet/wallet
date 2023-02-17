
import React, { useEffect, useState } from 'react';
import styles from './index.scss';

import Header from '~components/Header';

import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import ICON_SWAP from '~assets/images/icon_swap.svg';
import NextStepButton from '~components/NextStepButton';
import { useSelector } from 'react-redux';
import { selectTokensInfo, selectTokensInfoById } from '~state/tokens';
import { keyable } from '~scripts/Background/types/IAssetsController';
import TokenSelectorDropdown from '~components/TokenSelectorDropdown';
import useToast from '~hooks/useToast';
import { useController } from '~hooks/useController';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import useQuery from '~hooks/useQuery';
import ICON_MINT from '~assets/images/icon_mint.svg';
import clsx from 'clsx';
import { getTokenInfo } from '~global/tokens';
import ICON_ICP from '~assets/images/icon_icp_details.png';
import { selectAccountById, selectBalanceById } from '~state/wallet';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ accountId: string, tokenId: string }> {
}


const Swap = ({
  match: {
    params: { accountId, tokenId },
  },
}: Props) => {
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;

  const queryParams = useQuery();
  const type: string = queryParams.get('type') || '';

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<keyable>({ symbol: "", id: "" });
  const [selectedSecondAmount, setSelectedSecondAmount] = useState<number>(0);
  const [selectedSecondToken, setSelectedSecondToken] = useState<keyable>({ symbol: "", id: "" });

  const tokenInfo = useSelector(selectTokensInfoById(tokenId));
  const tokenInfos = useSelector(selectTokensInfo);
  const { show } = useToast();
  const [pairRatio, setPairRatio] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);

  const controller = useController();
  const [priceFetch, setPriceFetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const currentBalance: keyable = useSelector(selectBalanceById(address));
  const maxAmount = currentBalance?.value / Math.pow(10, currentBalance?.currency?.decimals) - getTokenInfo(tokenId).fees;


  useEffect((): void => {
    if ((selectedToken.id != "") && selectedSecondToken.id != "" && selectedSecondToken.id != null) {

      setPriceFetch(true);
      controller.tokens.getPair(selectedToken.id, selectedSecondToken.id).then((response) => {
        setTotalSupply(response?.stats?.total_supply);
        setPairRatio(response.ratio);
        setPriceFetch(false);
        updateAmount(0);
      });
    }
  }, [selectedToken.id, selectedSecondToken.id]);

  const updateAmount = (amount: number) => {
    if (selectedSecondToken?.id == null) {
      show(i18nT('swap.selectSec'));
      return;
    }
    setSelectedAmount(amount);
    if (pairRatio != 1) {
      if (amount < getTokenInfo(tokenId).fees) {
        setSelectedSecondAmount(0);
        return;
      }
      let selectedAmount: number = pairRatio * (amount - getTokenInfo(tokenId).fees);
      setSelectedSecondAmount(Number(selectedAmount?.toFixed(5)));
    }
    else if (pairRatio == 1) {
      if (amount < getTokenInfo(tokenId).fees) {
        setSelectedSecondAmount(0);
        return;
      }
      setSelectedSecondAmount(Number(amount - getTokenInfo(tokenId).fees));
    }
    if (selectedAmount > maxAmount) {
      show(i18nT('swap.inSuf'));
    }
  }
  const updateSecondAmount = (amount: number) => {
    if (pairRatio != 0 && pairRatio != 1) {
      let selectedAmount: number = (amount + getTokenInfo(tokenId).fees) / pairRatio;
      setSelectedAmount(Number(selectedAmount?.toFixed(5)));
      setSelectedSecondAmount(amount);
      if (selectedAmount > maxAmount) {
        show(i18nT('swap.inSuf'));
      }
    }
    else if (pairRatio == 1) {
      let selectedAmount: number = Number(amount?.toFixed(4) + getTokenInfo(tokenId).fees);
      setSelectedAmount(selectedAmount);
      setSelectedSecondAmount(amount);
      if (selectedAmount > maxAmount) {
        show(i18nT('swap.inSuf'));
      }
    }
    else {
      setSelectedSecondAmount(amount);
    }
  }

  const swap = async () => {
    setLoading(true);
    const response = await controller.tokens.swap(selectedToken.id, selectedSecondToken.id, selectedAmount);
    setPairRatio(response.ratio);
    setTotalSupply(response?.stats?.total_supply);
    show(i18nT('swap.stakeCompl'));
    await controller.tokens.getTokenBalances(address);
    show(i18nT('swap.done'));
    setLoading(false);

  }

  const mint = async () => {
    const txnId = await controller.tokens.createMintTx({
      from: selectedToken.id,
      to: selectedSecondToken.id,
      fromAmount: selectedAmount.toString(),
      address,
      pairRatio: pairRatio.toString()
    })
    history.push('/transaction/confirm/' + txnId);
  }
  const swapSelectedTokens = () => {
    const _selectedToken = { ...selectedToken };
    const _selectedSecondToken = { ...selectedSecondToken };

    setSelectedToken(_selectedSecondToken);
    setSelectedSecondToken(_selectedToken);
  }
  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={type == 'mint' ? 'Mint' : 'Swap'}
      ><div className={styles.empty} /></Header>
      <div>
        <div className={styles.etxt}>{i18nT('swap.info')}</div>

        <div className={styles.swapCont}>
          <div className={styles.firstInputCont}>
            <TokenSelectorDropdown
              loading={priceFetch}
              tokenInfo={{ symbol: 'ICP', icon: ICON_ICP, id: 'ICP', type: 'network' }}
              tokenInfos={tokenInfos}
              filterTokenId={tokenId}
              setSelectedAmount={updateAmount}
              selectedAmount={selectedAmount}
              setSelectedToken={setSelectedToken}
              selectedToken={selectedToken}
              address={address}
              noDropdown
            />
            <div
              onClick={() => type == 'mint' ? console.log() : swapSelectedTokens()}
              className={styles.swapbtn}><img src={type == 'mint' ? ICON_MINT : ICON_SWAP} /></div>
          </div>
          <TokenSelectorDropdown
            loading={priceFetch}
            tokenInfo={{ icon: tokenInfo.icon, symbol: tokenInfo.symbol, id: tokenId }}
            tokenInfos={tokenInfos}
            setSelectedAmount={updateSecondAmount}
            selectedAmount={selectedSecondAmount}
            setSelectedToken={setSelectedSecondToken}
            selectedToken={selectedSecondToken}
            address={address}
            hideMax
            noDropdown
          />
        </div>
      </div>
      <div className={styles.statsCont}>
        <div className={styles.statsCol}>
          <div className={styles.statKey}>
            {type == "mint" ? i18nT('swap.mintFees') : i18nT('swap.swapFees')}
          </div>
          <div className={clsx(styles.statVal, styles.statVal_small)}>
            {type == "mint" ? tokenInfo.fees : "0.3%"}
          </div>
        </div>
        <div className={styles.statsCol}>
          <div className={styles.statKey}>
            {i18nT('swap.price')}
          </div>
          <div className={styles.statVal}>
            {priceFetch
              ? <SkeletonTheme color="#a5acbb36" highlightColor="#eee">
                <Skeleton width={60} />
              </SkeletonTheme>
              : selectedToken?.symbol == ""
                ? "-"
                : pairRatio?.toFixed(3)
            }
          </div>
          <div className={styles.statKey}>
            {selectedToken?.symbol}/{selectedSecondToken?.symbol || "?"}
          </div>
        </div>
        <div className={styles.statsCol}>
          <div className={styles.statKey}>
            {i18nT('swap.totalSupply')}
          </div>
          <div className={styles.statVal}>
            {priceFetch
              ? <SkeletonTheme color="#a5acbb36" highlightColor="#eee">
                <Skeleton width={45} />
              </SkeletonTheme>
              : selectedToken?.symbol == ""
                ? "-"
                : totalSupply
            }
          </div>
        </div>
      </div>
      <div className={styles.nextCont}>
        <NextStepButton
          disabled={selectedAmount == 0 || selectedAmount < getTokenInfo(tokenId).fees || selectedAmount > maxAmount}
          loading={loading}
          onClick={() => type == 'mint' ? mint() : swap()}
        >
          {type == 'mint' ? selectedAmount > maxAmount ? i18nT('swap.inSuf') : i18nT('swap.next') : i18nT('swap.swap')}
        </NextStepButton>
      </div>
    </div >
  );
};


export default withRouter(Swap);
