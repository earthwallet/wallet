import React, { useEffect } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
//~pages import ICON_ADD from '../../../assets/images/icon_add_account.svg';
import ICON_ADD from '~assets/images/icon_add_account.svg';
import clsx from 'clsx';
const Page = () => {
  //const hierarchy = [{}];
  useEffect(() => {
  }, []);

  return <div className={styles.page}>
    {true
      ? <div >
        <div className={styles.subtitle}>bringing crypto back to earth</div>
        <div className={styles.noAccountsActions}>
          <div className={styles.earthButtonCont}>
            <Link className={styles.link} to={'/account/create'}>
              <div className={styles.earthButton}>Create an Account</div>
            </Link>
          </div>
          <div className={styles.footerCont}><div className={styles.orSep}>or</div>
            <Link className={styles.link} to={'/account/import-seed'}><div className={styles.earthLink}>import seed phrase
            </div>
            </Link>
          </div>
        </div>
      </div>
      : (
        <>
          <>
            <div className={styles.accountTitle}>Select Account</div>
            <div className={styles.accountsCont}>
              {/* {hierarchy
                  .filter(({ genesisHash }) => selectedNetwork.genesisHash.length ? genesisHash === selectedNetwork.genesisHash : true)
                  .map((json, index): React.ReactNode => {
                    //   console.log('hierarchy', json);
                    return (
                      <AccountsTree
                        {...json}
                        key={`${index}:${json.address}`}
                      />
                    );
                  })} */}

              <Link className={styles.link} to={'/account/create'}>
                <div className={clsx(styles.createButton, styles.earthButton)}>
                  <div>Create an Account </div>
                  <img className='iconCopy'
                    src={ICON_ADD} />
                </div>
              </Link>
            </div>
          </>
          <div className={styles.footerCont}><div className={styles.orSep}>or</div>
            <Link className={styles.link} to={'/account/import-seed'}><div className={styles.earthLink}>import seed phrase
            </div>
            </Link>
          </div>
        </>
      )
    }
  </div>;
};

export default Page;
