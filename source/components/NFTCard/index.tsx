import React from 'react';
import styles from './index.scss';

const NFTCard = (props: any) => {
    return (
        <div className={styles.container}>
            <div className={styles.imgContainer}>
                <img src={props.img} className={styles.img} />
            </div>
            <span className={styles.text}>{props.text} ICP</span>
            <div className={styles.priceContainer}>
                <div className={styles.leftSideContainer}>
                    <span className={styles.price}>${props.price?.toFixed(3)}</span>
                </div>
            </div>
        </div>
    )
}

export default NFTCard
