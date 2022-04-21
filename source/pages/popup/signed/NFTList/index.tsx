
import React, { useState } from 'react';
import styles from './index.scss';
import Header from '~components/Header';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import Swiper from 'react-id-swiper';
import { selectAssetsICPByAddress, selectAssetsICPCountLoadingByAddress } from '~state/wallet';
import { useSelector } from 'react-redux';
import ICON_GRID from '~assets/images/icon_grid.svg';
import ICON_LIST from '~assets/images/icon_list.svg';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import { getAirDropNFTInfo, getTokenCollectionInfo, getTokenImageURL } from '~global/nfts';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAirdropStatus } from '~state/assets';

interface Props extends RouteComponentProps<{ address: string }> {
}


const NFTList = ({
    match: {
        params: { address },
    },
}: Props) => {
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

export const AssetsList = ({ address }: { address: string }) => {
    const assets: keyable = useSelector(selectAssetsICPByAddress(address));
    const loading: boolean = useSelector(selectAssetsICPCountLoadingByAddress(address));
    const airdropAsset = getAirDropNFTInfo();
    const airdropAssetStatus = useSelector(selectAirdropStatus(airdropAsset.id));

    const AirDropCampaign = () => {
        return <div
            onClick={() => history.push(`/nftairdropdetails/${airdropAsset.id}/${address}`)}
            className={styles.listitem}>
            <img className={styles.listicon}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = ICON_PLACEHOLDER;
                }}
                src={airdropAsset.icon} />
            <div className={styles.listinfo}>
                <div className={styles.listtitle}>{airdropAsset?.name}</div>
                <div className={styles.listsubtitle}>{airdropAsset?.description}</div>
            </div>
            <div
                className={styles.liststats}
            ><div className={styles.listprice}>{airdropAsset?.isAirdrop
                ? 'Airdrop'
                : 'Unlisted'}</div>
                {airdropAssetStatus.accountIdVerified == undefined
                    ? <div className={clsx(styles.listsubtitle, styles.freetxt)}>Free</div>
                    : <div className={clsx(styles.listsubtitle)}>Claimed</div>
                }
            </div>
            <img
                className={styles.listforward}
                src={ICON_FORWARD}
            />
        </div>
    }

    const history = useHistory();
    if (!loading && assets?.length == 0) {
        if (airdropAssetStatus?.airdropEnabled) {
            return <div className={styles.listitemscont}><AirDropCampaign /></div>
        }
        return <div className={styles.centerDiv}>No NFTs Found</div>
    } else {
        return <div className={styles.listitemscont}>
            {loading && <div
                className={clsx(styles.listitem, styles.listitemloading)}>
                <div
                    className={styles.listicon} >
                    <SkeletonTheme color="#222" highlightColor="#000">
                        <Skeleton className={styles.loadingicon} width={36} height={38} />
                    </SkeletonTheme>
                </div>
                <div className={styles.listinfo}>
                    <div className={styles.listtitle}>
                        <SkeletonTheme color="#222" highlightColor="#000">
                            <Skeleton />
                        </SkeletonTheme>
                    </div>
                </div>
                <div className={styles.liststats}></div>
                <SkeletonTheme color="#222" highlightColor="#000">
                    <Skeleton className={styles.listforward} />
                </SkeletonTheme>

            </div>}
            {airdropAssetStatus?.airdropEnabled && <AirDropCampaign />}
            {assets?.map((asset: keyable, i: number) => (<div
                key={i}
                onClick={() => history.push(`/nftdetails/${asset.id}`)}
                className={styles.listitem}>
                <img className={styles.listicon}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = ICON_PLACEHOLDER;
                    }}
                    src={getTokenImageURL(asset)} />
                <div className={styles.listinfo}>
                    <div className={styles.listtitle}>{asset?.title || asset?.tokenIndex}</div>
                    <div className={styles.listsubtitle}>{getTokenCollectionInfo(asset?.canisterId)?.name}</div>
                </div>
                <div
                    className={styles.liststats}
                ><div className={styles.listprice}>{asset?.forSale
                    ? 'For sale'
                    : 'Unlisted'}</div>
                    {asset?.forSale && <div className={styles.listsubtitle}>{(asset?.info?.price / 100000000)?.toFixed(2)} ICP</div>}
                </div>
                <img
                    className={styles.listforward}
                    src={ICON_FORWARD}
                />
            </div>))}
            {false && <div
                onClick={() => history.push('/account/marketplace/' + address)}
                className={styles.listitem}>
                <div
                    className={styles.listicon} >
                    <div>💎</div>
                </div>
                <div className={styles.listinfo}>
                    <div className={styles.listtitle}>Explore Collections</div>
                </div>
                <div className={styles.liststats}></div>
                <img
                    className={styles.listforward}
                    src={ICON_FORWARD}
                />
            </div>}
        </div>
    }
}

export const AssetsCoverflow = ({ address }: { address: string }) => {
    const assets: keyable = useSelector(selectAssetsICPByAddress(address));
    const airdropAsset = getAirDropNFTInfo();
    const airdropAssetStatus = useSelector(selectAirdropStatus(airdropAsset.id));

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
    if (assets?.length == 0 && !(airdropAssetStatus?.airdropEnabled)) {
        return <div className={styles.centerDivGrid}>No NFTs Found</div>
    } else {
        return (
            <Swiper
                //@ts-ignore
                effect={'coverflow'}
                slidesPerView={'auto'}
                {...params}>
                {airdropAssetStatus?.airdropEnabled && <div
                    onClick={() => history.push(`/nftairdropdetails/${airdropAsset.id}/${address}`)}
                    className={styles.imagecont}
                    style={{ backgroundImage: `url(${airdropAsset.icon})` }} >
                    <div className={styles.imagedesc}>
                        <div
                            onClick={() => history.push(`/nftdetails/${airdropAsset.id}`)}
                            className={styles.imagetitle}>{airdropAsset?.name}</div>
                        {airdropAssetStatus.accountIdVerified == undefined
                            ? <div className={styles.imagepagin}>
                                <span className={styles.freetxt}>Free</span>
                            </div>
                            : <div className={styles.imagepagin}>
                                Claimed
                            </div>
                        }
                    </div>
                </div>}
                {assets?.map((asset: keyable, i: number) => {
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
    }
};

export default withRouter(NFTList);
