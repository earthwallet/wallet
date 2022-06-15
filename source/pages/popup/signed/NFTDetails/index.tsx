import React, { useState, useEffect } from 'react';
import styles from './index.scss';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAssetById } from '~state/wallet';
import { getEarthArtCollectionIcon, getTokenImageURL } from '~global/nfts';
import clsx from 'clsx';
import { useController } from '~hooks/useController';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { selectCollectionInfo } from '~state/assets';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';
import { getTokenInfoFromTokenId } from '~utils/services';


interface Props extends RouteComponentProps<{ assetId: string }> {
    className?: string;
}

const NFTDetails = ({
    match: {
        params: {
            assetId,
        },
    },
}: Props) => {
    const history = useHistory();
    const canisterId: string | undefined = getTokenInfoFromTokenId(assetId).canister;
    const index = getTokenInfoFromTokenId(assetId).index;
    const assetInfo: keyable = { canisterId, tokenIndex: index, id: assetId, tokenIdentifier: assetId };

    const asset: keyable = useSelector(selectAssetById(assetId)) || assetInfo;
    const [loading, setLoading] = useState(false);
    const controller = useController();
    const assetCollectionInfo: keyable = useSelector(selectCollectionInfo(canisterId || ''));

    useEffect((): void => {
        setLoading(true);
        if (asset.symbol != 'ETH') {
            controller.assets.
                updateTokenCollectionDetails(asset).then(() => setLoading(false))
        }
        else {
            controller.assets.updateETHAssetInfo(asset).then(() => setLoading(false))
        }

    }, [assetId === asset?.id]);

    return (
        <div className={styles.page}>
            <div className={styles.stickyheader}>
                <Header
                    showBackArrow
                    text={('')}
                    type={'wallet'}
                ></Header>
            </div>
            <div className={styles.fullImage}
                style={{ backgroundImage: `url(${getTokenImageURL(asset)})` }} >
                <div className={styles.actions}>
                    <div onClick={() => history.push(`/account/send/${asset?.address}?assetId=${asset.id}`)}
                        className={styles.action}>Transfer</div>
                    {asset?.symbol != 'ETH' && <div
                        onClick={() => history.push(`/account/listnft/${asset?.address}?assetId=${asset.id}`)}
                        className={clsx(styles.action, styles.secAction)}>{asset?.forSale ? 'Update' : 'List for Sale'}</div>}
                    {asset?.forSale && <div
                        onClick={() => history.push(`/account/listnft/${asset?.address}?assetId=${asset.id}&cancel=true`)}
                        className={clsx(styles.action, styles.secAction)}>Cancel</div>}
                </div>
            </div>
            <div className={styles.mainCont}>
                <div className={styles.transCont}>
                    <div className={styles.title}>{asset?.title || asset?.tokenIndex}</div>
                    <div className={styles.subtitleCont}>
                        <div className={styles.subtitle}>{(loading || asset?.loading)
                            ? <SkeletonTheme color="#5A597E63" highlightColor="#222">
                                <Skeleton width={72} />
                            </SkeletonTheme>
                            : asset?.forSale
                                ? 'Listed for sale'
                                : 'Unlisted'}
                        </div>
                        {asset?.forSale && <div className={styles.price}>{(asset?.info?.price / 100000000).toFixed(3)} ICP</div>}
                    </div>
                    <div className={styles.sep}></div>
                    <div className={styles.creatorCont}>
                        <img
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = ICON_PLACEHOLDER;
                            }}
                            src={asset?.symbol == 'ETH'
                                ? ICON_PLACEHOLDER
                                : asset?.type == 'EarthArt'
                                    ? getEarthArtCollectionIcon(canisterId)
                                    : assetCollectionInfo?.icon}
                            className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>{asset?.symbol == 'ETH' ? asset.tokenName : assetCollectionInfo?.name}</div>
                            <div className={styles.creatorSubtitle}>{asset?.symbol == 'ETH' ? asset.description : assetCollectionInfo?.description}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default withRouter(NFTDetails);
