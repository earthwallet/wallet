import React from 'react';
import MarketplaceDropCard from '~components/MarketplaceDropCard';
import styles from './index.scss';
import img from '~assets/images/marketplaceImg.svg';
const Marketplace1 = () => {
  return (
    <div className={styles.page}>
      <MarketplaceDropCard
      img={img}
      text={"Motoko Day Drop"}
      subText={"On the Motoko programming language's 2nd birthday, the DFINITY Foundation distribtion"}
      priceText={"Floor Price"}
      price={"$350"}
      volumeText={"Trading Volume"}
      volPrice={"$133M"}
      buttonText={"View 563 Listings"}
      />
    </div>
  );
};

export default Marketplace1;
