
import React, { useState } from 'react';
import styles from './index.scss';
import Header from '~components/Header';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import Swiper from 'react-id-swiper';
import { selectAccountById, selectAssetsByAddressAndSymbol, selectAssetsICPCountLoadingByAddress } from '~state/wallet';
import { useSelector } from 'react-redux';
import ICON_GRID from '~assets/images/icon_grid.svg';
import ICON_LIST from '~assets/images/icon_list.svg';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import { getAirDropNFTInfo, getTokenImageURL, MARKETPLACE_ENABLED } from '~global/nfts';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAirdropStatus, selectCollectionInfo } from '~state/assets';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ accountId: string }> {
}

const AssetName = ({ canisterId }: { canisterId: string }) => {
    const assetInfo: keyable = useSelector(selectCollectionInfo(canisterId));
    return <>{assetInfo?.name}</>
}

const NFTList = ({
    match: {
        params: { accountId },
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
                    <AssetsCoverflow accountId={accountId} />
                </div>
                    : <div className={styles.listcont}>
                        <AssetsList accountId={accountId} />
                    </div>
                }
            </div>
        </div>
    );
};

export const AssetsList = ({ accountId }: { accountId: string }) => {
    const selectedAccount = useSelector(selectAccountById(accountId));
    const { address, symbol } = selectedAccount;
    const loading: boolean = useSelector(selectAssetsICPCountLoadingByAddress(address));
    const airdropAsset = getAirDropNFTInfo();
    const airdropAssetStatus = useSelector(selectAirdropStatus(airdropAsset.id));
    const assets: keyable = useSelector(selectAssetsByAddressAndSymbol(address, symbol));
    const SHOW_MARKETPLACE = selectedAccount.symbol == "ICP" && MARKETPLACE_ENABLED;

    const AirDropCampaign = () => {
        if (selectedAccount.symbol == 'ETH') {
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
        } else {
            return <div></div>
        }
    }

    const history = useHistory();
    if (!loading && assets?.length == 0) {
        if (SHOW_MARKETPLACE && airdropAssetStatus?.airdropEnabled)
            return <div className={styles.listitemscont}><AirDropCampaign />
                <ExploreCollections address={address} />
            </div>
        if (SHOW_MARKETPLACE) {
            return <ExploreCollections address={address} />
        }
        if (airdropAssetStatus?.airdropEnabled) {
            return <div className={styles.listitemscont}><AirDropCampaign /></div>
        }
        return <div className={styles.centerDiv}>{i18nT('nftList.noNFTs')}</div>
    } else {
        return <div className={styles.listitemscont}>
            {airdropAssetStatus?.airdropEnabled && <AirDropCampaign />}
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
            {SHOW_MARKETPLACE && <ExploreCollections address={address} />}
            {assets?.map((asset: keyable, i: number) => {
                return (<div
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
                        <div className={styles.listsubtitle}>
                            {asset?.symbol == 'ETH' ? asset.tokenName : <AssetName canisterId={asset.canisterId} />}
                        </div>
                    </div>
                    <div
                        className={styles.liststats}
                    ><div className={styles.listprice}>{asset?.forSale
                        ? i18nT('nftList.forSale')
                        : i18nT('nftList.unlisted')}</div>
                        {asset?.forSale && <div className={styles.listsubtitle}>{(asset?.info?.price / 100000000)?.toFixed(2)} ICP</div>}
                    </div>
                    <img
                        className={styles.listforward}
                        src={ICON_FORWARD} />
                </div>);
            })}
        </div>
    }
}

const ExploreCollections = ({ address }: { address: string }) => {
    const history = useHistory();
    return <div
        onClick={() => history.push('/account/marketplace/' + address)}
        className={styles.listitem}>
        <div
            className={styles.listicon} >
            <div>💎</div>
        </div>
        <div className={styles.listinfo}>
            <div className={styles.listtitle}>{i18nT('nftList.explore')}</div>
        </div>
        <div className={styles.liststats}></div>
        <img
            className={styles.listforward}
            src={ICON_FORWARD}
        />
    </div>
};

export const AssetsCoverflow = ({ accountId }: { accountId: string }) => {
    const selectedAccount = useSelector(selectAccountById(accountId));
    const { address, symbol } = selectedAccount;

    const assets: keyable = useSelector(selectAssetsByAddressAndSymbol(address, symbol));
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
        return <div className={styles.centerDivGrid}>{i18nT('nftList.noNFTs')}</div>
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
                        {airdropAssetStatus?.accountIdVerified == undefined
                            ? <div className={styles.imagepagin}>
                                <span className={styles.freetxt}>{i18nT('nftList.free')}</span>
                            </div>
                            : <div className={styles.imagepagin}>
                                {i18nT('nftList.claimed')}
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