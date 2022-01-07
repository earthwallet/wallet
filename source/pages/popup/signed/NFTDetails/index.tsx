import React, { useState, useEffect } from 'react';
import styles from './index.scss';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAssetById } from '~state/wallet';
import { getTokenCollectionInfo, getTokenImageURL } from '~global/nfts';
import clsx from 'clsx';
import { useController } from '~hooks/useController';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


interface Props extends RouteComponentProps<{ assetid: string }> {
    className?: string;
}

const NFTDetails = ({
    match: {
        params: {
            assetid,
        },
    },
}: Props) => {
    const history = useHistory();
    const asset: keyable = useSelector(selectAssetById(assetid));
    const [loading, setLoading] = useState(false);
    const controller = useController();

    useEffect((): void => {
        setLoading(true);
        controller.assets.
            updateTokenCollectionDetails(asset).then(() => setLoading(false))
    }, [assetid === asset?.id]);

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
                    <div onClick={() => history.push(`/account/send/${asset?.address}?assetid=${asset.id}`)}
                        className={styles.action}>Transfer</div>
                    <div
                        onClick={() => history.push(`/account/listnft/${asset?.address}?assetid=${asset.id}`)}
                        className={clsx(styles.action, styles.secAction)}>{asset?.forSale ? 'Update' : 'List for Sale'}</div>
                    {asset?.forSale && <div
                        onClick={() => history.push(`/account/listnft/${asset?.address}?assetid=${asset.id}&cancel=true`)}
                        className={clsx(styles.action, styles.secAction)}>Cancel</div>}
                </div>
            </div>
            <div className={styles.mainCont}>
                <div className={styles.transCont}>
                    <div className={styles.title}>{asset?.title || asset?.tokenIndex}</div>
                    <div className={styles.subtitleCont}>
                        <div className={styles.subtitle}>{(loading || asset?.loading)
                            ? <SkeletonTheme color="#5A597E63" highlightColor="#222">
                                <Skeleton width={150} />
                            </SkeletonTheme>
                            : asset?.forSale
                                ? 'Listed for sale'
                                : 'Unlisted'}
                        </div>
                        {asset?.forSale && <div className={styles.price}>{(asset?.info?.price / 100000000).toFixed(3)} ICP</div>}
                    </div>
                    <div className={styles.sep}></div>
                    <div className={styles.creatorCont}>
                        <img src={getTokenCollectionInfo(asset?.canisterId)?.icon} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>{getTokenCollectionInfo(asset?.canisterId)?.name}</div>
                            <div className={styles.creatorSubtitle}>{getTokenCollectionInfo(asset?.canisterId)?.description}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default withRouter(NFTDetails);
