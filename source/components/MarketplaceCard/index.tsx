import React from 'react';
import styles from './index.scss';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';

const MarketplaceCard = (props: any) => {

    return (
        <div className={styles.container}>
            <div className={styles.imgContainer}>
                <img
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = ICON_PLACEHOLDER;
                    }}
                    src={props.img} className={styles.img} />
            </div>
            <span className={styles.text}>{props.text}</span>
            <div className={styles.priceContainer}>
                <div className={styles.leftSideContainer}>
                    <span className={styles.volumeText}>Volume</span>
                    <span className={styles.volPrice}>${props.volPrice}</span>
                </div>
                <div className={styles.rightSideContainer}>
                    <span className={styles.priceText}>Floor Price</span>
                    <span className={styles.price}>${props.price}</span>
                </div>
            </div>
        </div>
    )
}

export default MarketplaceCard
