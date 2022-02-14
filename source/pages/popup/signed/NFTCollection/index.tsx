import React, { useState, useEffect } from 'react';
import styles from "./index.scss";
//import img from "~assets/images/marketplaceImg.svg";
import Header from '~components/Header';
import { getTokenCollectionInfo } from '~global/nfts';
import { keyable } from '~scripts/Background/types/IMainController';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import {
    canisterAgentApi,
    //decodeTokenId,
    getTokenIdentifier,
} from "@earthwallet/assets";
//import { ClipLoader } from 'react-spinners';
import NFTCard from '~components/NFTCard';
import { useSelector } from 'react-redux';
import { selectAssetBySymbol, selectStatsOfCollection } from '~state/assets';
import { getSymbol } from '~utils/common';
import useQuery from '~hooks/useQuery';
import millify from 'millify';
interface Props extends RouteComponentProps<{ nftId: string }> {
}

const NFTCollection = ({
    match: {
        params: { nftId },
    },
}: Props) => {
    const queryParams = useQuery();

    const history = useHistory();
    const nftCollObj = getTokenCollectionInfo(nftId);
    const [loading, setLoading] = useState<boolean>(false);
    const [listings, setListings] = useState<keyable>([]);
    const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol("ICP")?.coinGeckoId || ''));
    const address: string = queryParams.get('address') || '';
    const nftObj = useSelector(selectStatsOfCollection(nftId));

    useEffect(() => {
        const fetchNfts = async () => {
            setLoading(true);
            const response = await canisterAgentApi(nftId, 'listings');
            const listings = response.map((list: keyable) => ({
                id: list[0],
                price: list[1].price?.toString(),
                tokenId: getTokenIdentifier(
                    nftId,
                    list[0]
                ),
                icon: `https://${nftId}.raw.ic0.app/?cc=0&type=thumbnail&tokenid=${getTokenIdentifier(
                    nftId,
                    list[0]
                )}`
            })).sort((a: keyable, b: keyable) => (a.price - b.price));
            //[0][1].price
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
            <div className={styles.mainContainer}>
                <div className={styles.stats}>
                    <div className={styles.statrow}>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Listings</div>
                            <div className={styles.val}>{nftObj.listings ? millify(nftObj?.listings, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Collection Size</div>
                            <div className={styles.val}>{nftObj.tokens ? millify(nftObj?.tokens, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Sales</div>
                            <div className={styles.val}>{nftObj.sales ? millify(nftObj?.sales, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                    </div>
                    <div className={styles.statrow}>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Volume</div>
                            <div className={styles.val}>${nftObj.total ? millify(nftObj?.total * currentUSDValue?.usd, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Floor</div>
                            <div className={styles.val}>${nftObj?.floor ? millify(nftObj?.floor * currentUSDValue?.usd, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                    </div>
                </div>
                {loading ? [...Array(4)].map((_, index: number) => <NFTCard
                    key={index}
                    loading
                />) : listings.map((nftObj: keyable) => <div
                    key={nftObj.tokenId}
                    className={styles.nftcardcont}
                    onClick={() => history.push(`/nft/buy/${nftObj.tokenId}?price=${nftObj.price}&address=${address}`)}
                >
                    <NFTCard
                        id={nftObj.id}
                        img={nftObj.icon}
                        text={nftObj.price / Math.pow(10, 8)}
                        price={nftObj.price / Math.pow(10, 8) * currentUSDValue?.usd}
                    /></div>)}
            </div>
        </div>

    )
}

export default withRouter(NFTCollection)
