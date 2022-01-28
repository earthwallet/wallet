

import React from 'react';
import styles from './index.scss';
import ICON_FORWARD from '~assets/images/icon_forward.svg';

//import Loading from '~components/Loading';
//import Header from '~components/Header';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectConnectedDapps } from '~state/dapp';
import { getShortAddress } from '~utils/common';
import { keyable } from '~scripts/Background/types/IMainController';



const AppsList = () => {
    const history = useHistory();
    const dapps = useSelector(selectConnectedDapps);



    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div
                    className={clsx(styles.earthInputCont, styles.mnemonicInputCont)}
                >
                    {dapps.length !== 0 && dapps?.map((dapp: keyable) => <div
                        onClick={() => history.push('/dappdetails/' + encodeURIComponent(dapp?.origin))}
                        key={dapp.origin}
                        className={styles.checkboxCont}>
                        <div className={styles.checkboxContent}>
                            <img src={dapp?.logo} className={styles.networkIcon} />
                            <div>
                                <div className={styles.checkboxTitle}>
                                    {dapp?.origin} {dapp?.title}
                                </div>
                                <div className={styles.checkboxSubTitle}>
                                    {dapp?.address && getShortAddress(dapp?.address)}
                                </div>
                            </div>
                        </div>
                        <img
                            src={ICON_FORWARD}
                        />
                    </div>)}
                </div>
            </div>
        </div>
    );
};

export default AppsList;