// @ts-nocheck

import React, { useEffect, useState, useRef } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import Header from '~components/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
//import bg_wallet_details from '~assets/images/bg_wallet_details.png';
import icon_rec from '~assets/images/icon_rec.svg';
import icon_send from '~assets/images/icon_send.svg';
import { getSymbol } from '~utils/common';
import clsx from 'clsx';
import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';
import { getTransactions } from '@earthwallet/keyring';
import { useController } from '~hooks/useController';
import { selectBalanceByAddress } from '~state/wallet';
import { selectAssetBySymbol } from '~state/assets';

import { useHistory } from 'react-router-dom';
import ICON_NOTICE from '~assets/images/icon_notice.svg';
import { selectAssetsICPCountByAddress } from '~state/wallet';
import { ClipLoader } from 'react-spinners';
import ICON_GRID from '~assets/images/icon_grid.svg';
import ICON_LIST from '~assets/images/icon_list.svg';
import { selectAssetsICPByAddress } from '~state/wallet';
import Swiper from 'react-id-swiper';
import { getTokenCollectionInfo, getTokenImageURL } from '~global/nfts';
import { LIVE_SYMBOLS_OBJS } from '~global/constant';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import { AssetsList, AssetsCoverflow } from '../NFTList';

interface Props extends RouteComponentProps<{ address: string }> {
}
interface keyable {
  [key: string]: any
}

const TokenHistory = ({
  match: {
    params: { address },
  },
}: Props) => {



  return (
    <div className={styles.page}>

    </div>
  );
};


export default withRouter(TokenHistory);