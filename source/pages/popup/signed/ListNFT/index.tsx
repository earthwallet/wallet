import React from 'react';
import Header from '~components/Header';
import styles from './index.scss';

const Page = () => {
    return <div className={styles.page}>
        <Header
            showBackArrow
            text={'List NFT'}
            type={'wallet'}
        ><div style={{ width: 39 }}></div></Header>
    </div>;
};

export default Page;
