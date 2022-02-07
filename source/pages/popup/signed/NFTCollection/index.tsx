import React, { useState, useEffect } from 'react';
import styles from "./index.scss";
//import img from "~assets/images/marketplaceImg.svg";
import Header from '~components/Header';
import { getTokenCollectionInfo } from '~global/nfts';
import { keyable } from '~scripts/Background/types/IMainController';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    canisterAgentApi,
    //decodeTokenId,
    getTokenIdentifier,
} from "@earthwallet/assets";
import { ClipLoader } from 'react-spinners';
import NFTCard from '~components/NFTCard';
import { useSelector } from 'react-redux';
import { selectAssetBySymbol } from '~state/assets';
import { getSymbol } from '~utils/common';
interface Props extends RouteComponentProps<{ nftId: string }> {
}

const NFTCollection = ({
    match: {
        params: { nftId },
    },
}: Props) => {

    const nftCollObj = getTokenCollectionInfo(nftId);
    const [loading, setLoading] = useState<boolean>(false);
    const [listings, setListings] = useState<keyable>([]);
    const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol("ICP")?.coinGeckoId || ''));

    useEffect(() => {
        const fetchNfts = async () => {
            setLoading(true);
            const response = await canisterAgentApi(nftId, 'listings');
            console.log(response, 'response');
            const listings = response.map((list: keyable) => ({
                id: list[0],
                price: list[1].price?.toString(),
                icon: `https://${nftId}.raw.ic0.app/?cc=0&type=thumbnail&tokenid=${getTokenIdentifier(
                    nftId,
                    list[0]
                )}`
            })).sort((a: keyable, b: keyable) => (a.price - b.price));
            //[0][1].price
            console.log(listings, 'listings');
            setListings(listings);
            setLoading(false);

        }
        fetchNfts();
    }, [nftId !== null]);
    return (
        <div className={styles.page}>
            <Header
                className={styles.header}
                showMenu
                type={'wallet'}
                text={nftCollObj.name}
            ><div className={styles.empty} /></Header>
            {loading ? <div className={styles.loadingCont}><ClipLoader color={'#fffff'} /></div> : <div className={styles.mainContainer}>
                {listings.map((nftObj: keyable) => <div
                    key={nftObj.id}
                >
                    <NFTCard
                        img={nftObj.icon}
                        text={nftObj.price / Math.pow(10, 8)}
                        price={nftObj.price / Math.pow(10, 8) * currentUSDValue?.usd}
                    /></div>)}
            </div>}
        </div>
    )
}

export default withRouter(NFTCollection)
