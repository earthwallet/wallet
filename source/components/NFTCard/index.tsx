import React from 'react';
import styles from './index.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const NFTCard = (props: any) => {
    return (
        <div className={styles.container}>
            <div className={styles.imgContainer}>
                <LazyLoadImage
                    alt={props.id}
                    height={156}
                    src={props.img} // use normal <img> attributes as props
                    width={156} />
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
