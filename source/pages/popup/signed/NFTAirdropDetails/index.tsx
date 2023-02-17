import React, { useState, useEffect } from 'react';
import styles from './index.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { getAirDropNFTInfo, } from '~global/nfts';
import { useController } from '~hooks/useController';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { shareTweetURL, shortenAddress } from '~global/helpers';
import ICON_TWITTER from '~assets/images/icon_twitter.svg';
import { selectAirdropStatus } from '~state/assets';
import Confetti from 'react-confetti'
import { selectAccountById } from '~state/wallet';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ assetId: string, accountId: string }> {

    className?: string;
}

const NFTAirdropDetails = ({
    match: {
        params: {
            assetId,
            accountId

        },
    },
}: Props) => {
    const selectedAccount = useSelector(selectAccountById(accountId));
    const { address } = selectedAccount;


    const asset: keyable = getAirDropNFTInfo();
    const airdropAssetStatus = useSelector(selectAirdropStatus(asset.id));

    const [loading, setLoading] = useState(false);
    const controller = useController();

    useEffect((): void => {
        setLoading(true);
        controller.assets.
            registerExtensionForAirdrop().then(() => setLoading(false))
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
                {airdropAssetStatus?.accountIdVerified
                    ? <>
                        <div className={styles.congrats}>{asset.claimedTxt} {shortenAddress(airdropAssetStatus?.accountIdVerified)} 🎉</div>
                        <Confetti
                            width={375}
                            height={600}
                        />
                    </>
                    : <div className={styles.actions}>
                        <a
                            target="_blank"
                            href={shareTweetURL({
                                ...airdropAssetStatus?.ctaObj,
                                text: airdropAssetStatus?.ctaObj?.text.replace('PLACEHOLDER', address),
                            })}
                            className={styles.action}><img src={ICON_TWITTER} className={styles.twitterIcon} ></img>{asset?.twitterButtonCTA}</a>
                    </div>}

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
                                ? i18nT('nftAirdropDetails.listed')
                                : i18nT('nftAirdropDetails.airdrop')}
                        </div>
                        {airdropAssetStatus?.accountIdVerified == undefined ? <div className={styles.price}>{i18nT('nftAirdropDetails.free')}</div> : <div className={styles.price}>{i18nT('nftAirdropDetails.claimed')}</div>}
                    </div>
                    <div className={styles.sep}></div>
                    <div className={styles.creatorCont}>
                        <img src={asset.icon} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>{asset?.name}</div>
                            <div className={styles.creatorSubtitle}>{asset?.description}</div>
                            <div className={styles.disclaimer}>{asset?.disclaimer}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(NFTAirdropDetails);
