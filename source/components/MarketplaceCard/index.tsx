import React from 'react';
import styles from './index.scss';

const MarketplaceCard = (props: any) => {
    return (
        <div className={styles.container}>
            <div className={styles.imgContainer}>
                <img src={props.img} className={styles.img} />
            </div>
            <span className={styles.text}>{props.text}</span>
            <div className={styles.priceContainer}>
                <div className={styles.leftSideContainer}>
                    <span className={styles.priceText}>{props.priceText}</span>
                    <span className={styles.price}>{props.price}</span>
                </div>
                <div className={styles.rightSideContainer}>
                    <span className={styles.volumeText}>{props.volumeText}</span>
                    <span className={styles.volPrice}>{props.volPrice}</span>
                </div>
            </div>
        </div>
    )
}

export default MarketplaceCard
