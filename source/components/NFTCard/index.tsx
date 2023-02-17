import React from 'react';
import styles from './index.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const NFTCard = (props: any) => {
    return (
        <div className={styles.container}>
            <div className={styles.imgContainer}>
                {props.loading
                    ? <SkeletonTheme color="#222" highlightColor="#000">
                        <Skeleton className={styles.loadingicon} width={156} height={156} />
                    </SkeletonTheme>
                    : <LazyLoadImage
                        alt={props.id}
                        height={156}
                        src={props.img}
                        width={156} />}
            </div>
            {props.loading ? <span className={styles.text}>
                <SkeletonTheme color="#222" highlightColor="#000">
                    <Skeleton />
                </SkeletonTheme></span>
                : <span className={styles.text}>{props.id}</span>}
            <div className={styles.priceContainer}>
                <div className={styles.rightSideContainer}>
                    {props.loading ? <span className={styles.price}>
                        <SkeletonTheme color="#222" highlightColor="#000">
                            <Skeleton />
                        </SkeletonTheme></span>
                        : <span className={styles.price}>{props.text} ICP</span>}
                </div>
                <div className={styles.leftSideContainer}>
                    {props.loading ? <span className={styles.price}>
                        <SkeletonTheme color="#222" highlightColor="#000">
                            <Skeleton />
                        </SkeletonTheme></span>
                        : <span className={styles.price}>${props.price?.toFixed(3)}</span>}
                </div>
            </div>
        </div>
    )
}

export default NFTCard
