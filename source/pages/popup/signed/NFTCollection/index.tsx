import React from 'react';
import MarketplaceCard from '~components/MarketplaceCard';
import styles from "./index.scss";
//import img from "~assets/images/marketplaceImg.svg";
import Header from '~components/Header';
import { getTokenCollectionInfo, LIVE_ICP_NFT_LIST } from '~global/nfts';
import { keyable } from '~scripts/Background/types/IMainController';
import { RouteComponentProps, withRouter } from 'react-router-dom';
interface Props extends RouteComponentProps<{ nftId: string }> {
}

const NFTCollection = ({
    match: {
        params: { nftId },
    },
}: Props) => {

    const nftCollObj = getTokenCollectionInfo(nftId);
    return (
        <div className={styles.page}>
            <Header
                className={styles.header}
                showMenu
                type={'wallet'}
                text={nftCollObj.name}
            ><div className={styles.empty} /></Header>
            <div className={styles.mainContainer}>
                {LIVE_ICP_NFT_LIST.map((nftObj: keyable) => <div>
                    <MarketplaceCard
                        img={nftObj.icon}
                        text={nftObj.name}
                        priceText={"Floor Price"}
                        price={"$350"}
                        volumeText={"Volume"}
                        volPrice={"$133M"}
                    /></div>)}


            </div>
        </div>
    )
}

export default withRouter(NFTCollection)
