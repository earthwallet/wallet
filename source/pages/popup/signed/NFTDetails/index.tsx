import React from 'react';
import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import Header from '~components/Header';
import ICON_EARTH from '~assets/images/icon-128.png';


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
    console.log(assetid);
    return (
        <div className={styles.page}>

            <div className={styles.fullImage}></div>
            <div className={styles.mainCont}>
                <Header
                    showBackArrow
                    text={('')}
                    type={'wallet'}
                ></Header>
                <div className={styles.action}>Transfer</div>
                <div className={styles.transCont}>
                    <div className={styles.title}>Natures call</div>
                    <div className={styles.subtitleCont}>
                        <div className={styles.subtitle}>Mint 1 of 21</div>
                        <div className={styles.price}>0.25 ETH</div>
                    </div>
                    <div className={styles.sep}></div>
                    <div className={styles.creatorCont}>
                        <img src={ICON_EARTH} className={styles.creatorIcon}></img>
                        <div className={styles.creatorInfo}>
                            <div className={styles.creatorTitle}>Earth Association</div>
                            <div className={styles.creatorSubtitle}>Society</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default withRouter(NFTDetails);
