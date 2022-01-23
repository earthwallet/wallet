

import React, { //useState, 
  useEffect, useCallback
} from 'react';
import styles from './index.scss';
//import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
//import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';

//import Loading from '~components/Loading';
import NextStepButton from '~components/NextStepButton';
import Header from '~components/Header';
import clsx from 'clsx';
import { useController } from '~hooks/useController';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
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
            Tokens Listed
          </div>
        </div>
        <div
          className={clsx(styles.earthInputCont, styles.mnemonicInputCont)}
        >
          {groupId}
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