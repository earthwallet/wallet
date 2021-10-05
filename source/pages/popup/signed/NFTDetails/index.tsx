import React from 'react';
import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
//import ICON_EARTH from '~assets/images/icon-128.png';
import { useSelector } from 'react-redux';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAssetById } from '~state/wallet';


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
    //const history = useHistory();
    const asset: keyable = useSelector(selectAssetById(assetid));
    console.log(assetid, asset);

    return (
        <div className={styles.page}>

            <div className={styles.fullImage} style={{ backgroundImage: `url(https://${asset?.canisterId}.raw.ic0.app/?tokenid=${asset?.tokenIdentifier})` }} >

            </div>
            <div className={styles.mainCont}>
                <Header
                    showBackArrow
                    text={('')}
                    type={'wallet'}
                ></Header>
                <div className={styles.action}>Transfer</div>
                <div className={styles.transCont}>
                    <div className={styles.title}>{asset?.title || asset?.tokenIndex}</div>
                    <div className={styles.subtitleCont}>
                        <div className={styles.subtitle}>{asset?.forSale ? 'Listed for sale' : 'Unlisted'}</div>
                        <div className={styles.price}>{Math.floor(asset?.info.price / 100000000)} ICP</div>
                    </div>
                    <div className={styles.sep}></div>
                    {/*     <div className={styles.creatorCont}>
                        <img src={ICON_EARTH} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>Earth Association</div>
                            <div className={styles.creatorSubtitle}>Society</div>
                        </div>
                    </div> */}
                </div>
            </div>

        </div>
    );
};

export default withRouter(NFTDetails);
