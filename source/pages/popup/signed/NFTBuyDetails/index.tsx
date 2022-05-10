import React from 'react';
import styles from './index.scss';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
//import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
//import { selectAssetById } from '~state/wallet';
import { getEarthArtCollectionIcon, getTokenImageURL } from '~global/nfts';
import clsx from 'clsx';
//import { useController } from '~hooks/useController';
//import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import useQuery from '~hooks/useQuery';
import { decodeTokenId } from '@earthwallet/assets';
import useToast from '~hooks/useToast';
import { useSelector } from 'react-redux';
import { selectBalanceByAddress } from '~state/wallet';
import { selectCollectionInfo } from '~state/assets';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';


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
    const price: number = parseInt(queryParams.get('price') || '');
    const address: string = queryParams.get('address') || '';
    const type: string = queryParams.get('type') || '';

    const history = useHistory();
    const currentBalance: keyable = useSelector(selectBalanceByAddress(address));

    const canisterId = decodeTokenId(nftId).canister;
    const tokenIndex = decodeTokenId(nftId).index;

    const asset: keyable = { canisterId, id: nftId, type, tokenIndex, tokenIdentifier: nftId };
    const { show } = useToast();

    const assetCollectionInfo: keyable = useSelector(selectCollectionInfo(canisterId));

    const buy = () => {
        console.log(currentBalance?.value)
        if (1 != 1 && currentBalance?.value < price) {
            show('Not Enough Balance');
        }
        else {
            history.push(`/nft/settle/${nftId}?price=${price}&address=${address}&type=${type}`);
        }
    };
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
                    <div

                        onClick={() => buy()}
                        className={clsx(styles.action, styles.secAction)}>Buy</div>
                </div>
            </div>
            <div className={styles.mainCont}>
                <div className={styles.transCont}>
                    <div className={styles.title}>{tokenIndex}</div>
                    <div className={styles.subtitleCont}>
                        <div className={styles.subtitle}>For sale</div>
                        {<div className={styles.price}>{(price / 100000000).toFixed(3)} ICP</div>}
                    </div>
                    <div className={styles.sep}></div>
                    <div className={styles.creatorCont}>
                        <img
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = ICON_PLACEHOLDER;
                            }}
                            src={asset?.type == 'EarthArt' ? getEarthArtCollectionIcon(canisterId) : assetCollectionInfo?.icon} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>{assetCollectionInfo?.name}</div>
                            <div className={styles.creatorSubtitle}>{assetCollectionInfo?.description}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default withRouter(NFTBuyDetails);
