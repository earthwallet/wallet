import React from 'react';
import MarketplaceCard from '~components/MarketplaceCard';
import styles from "./index.scss";
import img from "~assets/images/marketplaceImg.svg";

const Marketplace2 = () => {
    return (
        <div className={styles.page}>
            <div className={styles.mainContainer}>
                <MarketplaceCard
                    img={img}
                    text={"Motoko Day Drop"}
                    priceText={"Floor Price"}
                    price={"$350"}
                    volumeText={"Volume"}
                    volPrice={"$133M"}
                />
                <MarketplaceCard
                    img={img}
                    text={"Motoko Day Drop"}
                    priceText={"Floor Price"}
                    price={"$350"}
                    volumeText={"Volume"}
                    volPrice={"$133M"}
                />
                <MarketplaceCard
                    img={img}
                    text={"Motoko Day Drop"}
                    priceText={"Floor Price"}
                    price={"$350"}
                    volumeText={"Volume"}
                    volPrice={"$133M"}
                />
                <MarketplaceCard
                    img={img}
                    text={"Motoko Day Drop"}
                    priceText={"Floor Price"}
                    price={"$350"}
                    volumeText={"Volume"}
                    volPrice={"$133M"}
                />
                <MarketplaceCard
                    img={img}
                    text={"Motoko Day Drop"}
                    priceText={"Floor Price"}
                    price={"$350"}
                    volumeText={"Volume"}
                    volPrice={"$133M"}
                />
                <MarketplaceCard
                    img={img}
                    text={"Motoko Day Drop"}
                    priceText={"Floor Price"}
                    price={"$350"}
                    volumeText={"Volume"}
                    volPrice={"$133M"}
                />
            </div>
        </div>
    )
}

export default Marketplace2
