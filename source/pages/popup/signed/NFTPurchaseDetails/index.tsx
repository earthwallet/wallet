import React, { useEffect, useState } from 'react';
import styles from './index.scss';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
import { keyable } from '~scripts/Background/types/IMainController';
import { getTokenCollectionInfo, getTokenImageURL } from '~global/nfts';
import clsx from 'clsx';
import { useController } from '~hooks/useController';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import useQuery from '~hooks/useQuery';
import { decodeTokenId } from '@earthwallet/assets';
import Confetti from 'react-confetti'
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';
import { i18nT } from '~i18n/index';


interface Props extends RouteComponentProps<{ nftId: string }> {
    className?: string;
}

const NFTBuyDetails = ({
    match: {
        params: {
            nftId,
        },
    },
}: Props) => {
    const queryParams = useQuery();
    const accountId: string = queryParams.get('accountId') || '';
    const selectedAccount = useSelector(selectAccountById(accountId));
    const { address } = selectedAccount;

    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const controller = useController();

    const canisterId = decodeTokenId(nftId).canister;
    const index = decodeTokenId(nftId).index;

    const asset: keyable = { canisterId, address, id: nftId, tokenIdentifier: nftId };

    useEffect((): void => {
        setLoading(true);
        controller.assets.getICPAssetsOfAccount({ address, symbol: 'ICP' }).then(() => {
            history.replace(`/nftdetails/${nftId}`);
            setLoading(false);
        });
    }, []);

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
                <div className={styles.congrats}>{i18nT("nftPurchaseDetails.congratsTxt")}</div>
                <Confetti
                    width={375}
                    height={600}
                />
                <div className={styles.actions}>
                    <div
                        className={clsx(styles.action, styles.secAction)}><ClipLoader color={'#fffff'}
                            size={15} /></div>
                </div>
            </div>
            <div className={styles.mainCont}>
                <div className={styles.transCont}>
                    <div className={styles.title}>{index}</div>
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
                        <img src={getTokenCollectionInfo(canisterId)?.icon} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>{getTokenCollectionInfo(canisterId)?.name}</div>
                            <div className={styles.creatorSubtitle}>{getTokenCollectionInfo(canisterId)?.description}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default withRouter(NFTBuyDetails);
