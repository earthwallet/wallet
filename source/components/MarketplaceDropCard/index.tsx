import React from 'react';
import styles from './index.scss';

const MarketplaceDropCard = (props: any) => {
  return (
    <div className={styles.mainContainer}>
      <img src={props.img} />
      <span className={styles.text}>{props.text}</span>
      <span className={styles.subText}>{props.subText}</span>
      <div className={styles.priceContainer}>
        <div className={styles.leftSideContainer}>
          <span className={styles.priceText}>{props.priceText}</span>
          <span className={styles.price}>{props.price}</span>
        </div>
        <div className={styles.rightSideContaier}>
          <span className={styles.volumeText}>{props.volumeText}</span>
          <span className={styles.volPrice}>{props.volPrice}</span>
        </div>
      </div>
      <button className={styles.button}>{props.buttonText}</button>
    </div>
  );
};

export default MarketplaceDropCard;
