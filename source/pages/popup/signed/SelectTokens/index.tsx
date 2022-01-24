

import React, { //useState, 
  useEffect, useCallback
} from 'react';
import styles from './index.scss';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';

//import Loading from '~components/Loading';
import NextStepButton from '~components/NextStepButton';
import Header from '~components/Header';
import clsx from 'clsx';
import { useController } from '~hooks/useController';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { selectTokensInfo } from '~state/token';
import { keyable } from '~scripts/Background/types/IAssetsController';
//import { useSelector } from 'react-redux';
//import { selectActiveAccountsByGroupId } from '~state/wallet';
//import { LIVE_SYMBOLS_OBJS } from '~global/constant';

interface Props extends RouteComponentProps<{ groupId: string }> {
}

const AddNetwork = ({
  match: {
    params: { groupId },
  },
}: Props) => {
  const controller = useController();
  const history = useHistory();
  const tokens = useSelector(selectTokensInfo);

  const getTokens = useCallback(() => {
    //)
    controller.tokens.getTokens()

  }, [history]);

  useEffect(() => {
    getTokens();
  }, []);

  /*  const toggleSymbol = (symbol: string) => {
     setCheckedArr(checkedArr => {
       if (checkedArr.includes(symbol)) {
         return checkedArr.filter(_symbol => _symbol !== symbol);
       }
       else {
         return [...checkedArr, symbol]
       }
     });
   }; */

  return (
    <div className={styles.page}>
      <Header
        type={'wallet'}
        text={'Select Tokens'}
      ><div className={styles.empty} /></Header>
      <div className={styles.container}>
        <div className={styles.earthInputCont}>
          <div className={styles.labelText}>
            Tokens Listed {groupId}
          </div>
        </div>
        <div
          className={clsx(styles.earthInputCont, styles.mnemonicInputCont)}
        >
          {tokens.map((symbolObj: keyable) => <div
            onClick={() => console.log(symbolObj.symbol)}
            key={symbolObj.symbol}
            className={clsx(styles.checkboxCont, symbolObj.symbol === "ICP" && styles.checkboxCont_disabled)}>
            <div className={styles.checkboxContent}>
              <div className={styles.networkIcon}>{symbolObj?.name?.charAt(0)}</div>
              <div className={styles.checkboxTitle}>
                <div>{symbolObj.name}</div>
                <div>{symbolObj.symbol}</div>
              </div>
            </div>
            {[''].includes(symbolObj?.symbol) ? (
              <img
                className={
                  clsx(styles.checkboxIcon, symbolObj.symbol === "ICP" && styles.checkboxIcon_disabled)}
                src={ICON_CHECKED}
              />
            ) : (
              <img
                className={styles.checkboxIcon}
                src={ICON_UNCHECKED}
              />
            )}
          </div>)}
        </div>
      </div>
      <div className={styles.nextCont}>
        <NextStepButton
          disabled={true}
        >
          {'Update'}
        </NextStepButton>
      </div>
    </div>
  );
};

export default withRouter(AddNetwork);