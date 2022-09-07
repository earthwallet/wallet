import React, { useState, useEffect } from 'react';
import styles from "./index.scss";
//import img from "~assets/images/marketplaceImg.svg";
import Header from '~components/Header';
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
import { selectAssetBySymbol, selectCollectionInfo, selectStatsOfCollection } from '~state/assets';
import { getSymbol } from '~utils/common';
import useQuery from '~hooks/useQuery';
import millify from 'millify';
import { Principal } from '@dfinity/principal';

interface Props extends RouteComponentProps<{ collectionId: string }> {
}

const NFTCollection = ({
    match: {
        params: { collectionId },
    },
}: Props) => {
    const queryParams = useQuery();

    const history = useHistory();
    const nftCollObj = useSelector(selectCollectionInfo(collectionId));
    const [loading, setLoading] = useState<boolean>(false);
    const [listings, setListings] = useState<keyable>([]);
    const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol("ICP")?.coinGeckoId || ''));
    const accountId: string = queryParams.get('accountId') || '';
    const nftObj = useSelector(selectStatsOfCollection(collectionId));

    useEffect(() => {
        const fetchNfts = async () => {
            setLoading(true);
            if (nftCollObj.type != 'EarthArt') {
                const response = await canisterAgentApi(collectionId, 'listings');
                const listings = response.map((list: keyable) => ({
                    id: list[0],
                    price: list[1].price?.toString(),
                    tokenId: getTokenIdentifier(
                        collectionId,
                        list[0]
                    ),
                    locked: list[1] && list[1]?.locked && list[1]?.locked[0] && Date.now() >= Number(list[1]?.locked[0] / 1000000n),
                    icon: `https://${collectionId}.raw.ic0.app/?cc=0&type=thumbnail&tokenid=${getTokenIdentifier(
                        collectionId,
                        list[0]
                    )}`
                })).filter((a: keyable) => !(a.locked)).sort((a: keyable, b: keyable) => (a.price - b.price));
                //[0][1].price
                console.log(listings, 'listings');
                setListings(listings);
            }
            else {
                const response = await canisterAgentApi('vvimt-yaaaa-aaaak-qajga-cai', 'getListingsByCanister', Principal.fromText(collectionId));
                const listings = response.map((list: keyable) => {
                    const collectionId = list[0].nft?.nftCanister.toText();
                    const tokenIndex = list[0].nft.nftIdentifier.nat32.toString();
                    const price = list[0].price?.toString();
                    return {
                        tokenId: getTokenIdentifier(
                            collectionId,
                            tokenIndex
                        ),
                        id: tokenIndex,
                        icon: `https://${collectionId}.raw.ic0.app/id/${tokenIndex}`,
                        price,
                    }
                });
                console.log(listings, 'listings');
                setListings(listings);
            }
            setLoading(false);

        }
        fetchNfts();
    }, [collectionId !== null]);
    return (
        <div className={styles.page}>
            <Header
                className={styles.header}
                showMenu
                type={'wallet'}
                text={nftCollObj?.name}
            ><div className={styles.empty} /></Header>
            <div className={styles.mainContainer}>
                <div className={styles.stats}>
                    <div className={styles.statrow}>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Listings</div>
                            <div className={styles.val}>{nftObj?.listings ? millify(nftObj?.listings, {
                                precision: 2,
                                lowercase: true
                            }) : (listings.length || '-')}</div>
                        </div>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Collection Size</div>
                            <div className={styles.val}>{nftObj?.tokens ? millify(nftObj?.tokens, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Sales</div>
                            <div className={styles.val}>{nftObj?.sales ? millify(nftObj?.sales, {
                                precision: 2,
                                lowercase: true
                            }) : '-'}</div>
                        </div>
                    </div>
                    <div className={styles.statrow}>
                        <div className={styles.statcol}>
                            <div className={styles.key}>Volume</div>
                            <div className={styles.val}>${nftObj?.total ? millify(nftObj?.total * currentUSDValue?.usd, {
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
                    key={nftObj?.tokenId}
                    className={styles.nftcardcont}
                    onClick={() => history.push(`/nft/buy/${nftObj?.tokenId}?price=${nftObj?.price}&accountId=${accountId}&type=${nftCollObj.type}`)}
                >
                    <NFTCard
                        id={nftObj?.id}
                        img={nftObj?.icon}
                        text={nftObj?.price / Math.pow(10, 8)}
                        price={nftObj?.price / Math.pow(10, 8) * currentUSDValue?.usd}
                    /></div>)}
            </div>
        </div>

    )
}

export default withRouter(NFTCollection)
