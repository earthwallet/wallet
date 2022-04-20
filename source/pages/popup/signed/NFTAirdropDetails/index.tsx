import React, { useState, useEffect } from 'react';
import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAssetById } from '~state/wallet';
import { getAirDropNFTInfo, } from '~global/nfts';
//import clsx from 'clsx';
import { useController } from '~hooks/useController';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { shareTweetURL } from '~global/helpers';
import ICON_TWITTER from '~assets/images/icon_twitter.svg';

interface Props extends RouteComponentProps<{ assetId: string, address: string }> {
    className?: string;
}

const NFTAirdropDetails = ({
    match: {
        params: {
            assetId,
            address
        },
    },
}: Props) => {
    // const history = useHistory();
    const assetInfo: keyable = getAirDropNFTInfo();

    const asset: keyable = useSelector(selectAssetById(assetId)) || assetInfo;
    const [loading, setLoading] = useState(false);
    const controller = useController();

    useEffect((): void => {
        setLoading(false);
        false && controller.assets.
            updateTokenCollectionDetails(asset).then(() => setLoading(false))
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
                style={{ backgroundImage: `url(${asset.icon})` }} >
                <div className={styles.actions}>
                    <a

                        target="_blank"
                        href={shareTweetURL({
                            text: `Hey there is the new earth wallet with ICP and BTC support. They are giving away an airdrop on earth day 🌍 Here is my ${address}`,
                            hashtags: 'EarthArt'
                        })}
                        className={styles.action}><img src={ICON_TWITTER} className={styles.twitterIcon} ></img>Tweet to claim NFT</a>
                </div>
            </div>
            <div className={styles.mainCont}>
                <div className={styles.transCont}>
                    <div className={styles.title}>{asset?.name || asset?.tokenIndex}</div>
                    <div className={styles.subtitleCont}>
                        <div className={styles.subtitle}>{(loading || asset?.loading)
                            ? <SkeletonTheme color="#5A597E63" highlightColor="#222">
                                <Skeleton width={72} />
                            </SkeletonTheme>
                            : asset?.forSale
                                ? 'Listed for sale'
                                : 'Airdrop'}
                        </div>
                        {asset?.isAirdrop && <div className={styles.price}>Free</div>}
                    </div>
                    <div className={styles.sep}></div>
                    <div className={styles.creatorCont}>
                        <img src={asset.icon} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>{asset?.name}</div>
                            <div className={styles.creatorSubtitle}>{asset?.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(NFTAirdropDetails);
