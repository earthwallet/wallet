import React from 'react';
import styles from './index.scss';
import Header from '~components/Header';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface Props extends RouteComponentProps<{ address: string }> {
}


const Wallet = ({
    match: {
        params: { address },
    },
}: Props) => {



    const history = useHistory();




    return (
        <div className={styles.page}>
            <Header
                className={styles.header}
                showMenu
                type={'wallet'}
                backOverride={() => history.push('/home')}
            />

            {address}
            <Link
                className={clsx(styles.resetLink, styles.bottomFixed)}
                to={`/account/details/${address}`}
            >
                <div className={styles.assetsAndActivityDiv}>
                    <div className={styles.tabsPill}></div>
                    <div className={styles.tabsView}>
                        <div
                            className={clsx(
                                styles.tabView,
                                styles.selectedTabView
                            )}
                        >
                            Previous Owners
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default withRouter(Wallet);