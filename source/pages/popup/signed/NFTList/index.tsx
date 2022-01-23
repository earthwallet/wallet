// @ts-nocheck

import React, { useState } from 'react';
import styles from './index.scss';
import Header from '~components/Header';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import { selectAssetsICPByAddress } from '~state/wallet';
import { useSelector } from 'react-redux';
import ICON_GRID from '~assets/images/icon_grid.svg';
import ICON_LIST from '~assets/images/icon_list.svg';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import { getTokenCollectionInfo, getTokenImageURL } from '~global/nfts';

interface Props extends RouteComponentProps<{ address: string }> {
}


const NFTList = ({
    match: {
        params: { address },
    },
}: Props) => {
    const history = useHistory();
    const [nav, setNav] = useState('list');


    return (
        <div className={styles.page}>
            <Header
                className={styles.header}
                showMenu
                type={'wallet'}
            />
            <div>
                <div className={styles.nav}>
                    <div className={styles.tabnav}>
                        NFT’s
                    </div>
                    <div className={styles.layoutnav}>
                        <img
                            onClick={() => setNav('grid')}
                            className={
                                clsx(
                                    styles.layoutnavicon,
                                    nav === 'grid' && styles.layoutnavicon_active
                                )}
                            src={ICON_GRID} />
                        <img
                            onClick={() => setNav('list')}
                            className={
                                clsx(
                                    styles.layoutnavicon,
                                    nav === 'list' && styles.layoutnavicon_active
                                )} src={ICON_LIST} />
                    </div>
                </div>

                <div className={styles.tabsep}></div>
                {nav === 'grid' ? <div className={styles.coverflowcont}>
                    <AssetsCoverflow address={address} />
                </div>
                    : <div className={styles.listcont}>
                        <AssetsList address={address} />
                    </div>
                }
            </div>

            {/*  <Link
                className={clsx(styles.resetLink, styles.bottomFixed)}
                to={`/account/details/${address}`}
            >
                <div className={styles.assetsAndActivityDiv}>
                    <div className={styles.tabsPill}></div>
                    <div className={styles.tabsView}>
                        <div
                            className={clsx(
                                styles.tabView,
                                styles.selectedTabView
                            )}
                        >
                            Previous Owners
                        </div>
                    </div>
                </div>
            </Link> */}
        </div>
    );
};

export const AssetsList = ({ address }) => {
    const assets: keyable = useSelector(selectAssetsICPByAddress(address));

    const history = useHistory();
    return <div className={styles.listitemscont}>
        {assets?.map((asset, i: number) => (<div
            key={i}
            onClick={() => history.push(`/nftdetails/${asset.id}`)}
            className={styles.listitem}>
            <img className={styles.listicon} src={getTokenImageURL(asset)} />
            <div className={styles.listinfo}>
                <div className={styles.listtitle}>{asset?.title || asset?.tokenIndex}</div>
                <div className={styles.listsubtitle}>{getTokenCollectionInfo(asset?.canisterId)?.name}</div>
            </div>
            <div
                className={styles.liststats}
            ><div className={styles.listprice}>{asset?.forSale
                ? 'For sale'
                : 'Unlisted'}</div>
                {asset?.forSale && <div className={styles.listsubtitle}>{Math.floor(asset?.info?.price / 100000000)} ICP</div>}
            </div>
            <img
                className={styles.listforward}
                src={ICON_FORWARD}
            />
        </div>))}
    </div>
}

export const AssetsCoverflow = ({ address }) => {
    const assets: keyable = useSelector(selectAssetsICPByAddress(address));

    const history = useHistory();

    const params = {
        grabCursor: true,
        centeredSlides: true,
        containerClass: "nftswipercontainer",
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
        },
        pagination: {
            el: '.swiper-pagination'
        }
    }
    return (
        <Swiper
            effect={'coverflow'}
            slidesPerView={'auto'}
            {...params}>
            {assets?.map((asset, i: number) => {
                return <div
                    key={i}
                    onClick={() => history.push(`/nftdetails/${asset.id}`)}
                    className={styles.imagecont}
                    style={{ backgroundImage: `url(${getTokenImageURL(asset)})` }} >
                    <div className={styles.imagedesc}>
                        <div
                            onClick={() => history.push(`/nftdetails/${asset.id}`)}
                            className={styles.imagetitle}>{asset?.title || asset?.tokenIndex}</div>
                        <div className={styles.imagepagin}>{i + 1} of {assets.length}</div></div>
                </div>
            })}
        </Swiper>
    )
};

export default withRouter(NFTList);