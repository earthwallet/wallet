import React, { useEffect } from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
//~pages import ICON_ADD from '../../../assets/images/icon_add_account.svg';
import ICON_ADD from '~assets/images/icon_add_account.svg';
import clsx from 'clsx';
import { useSelector } from "react-redux";
import { selectAccounts } from '~state/wallet';

const Page = () => {

  const accounts = useSelector(selectAccounts);

  console.log(accounts);
  //  const accounts = [];
  //const hierarchy = [{}];
  useEffect(() => {
  }, []);

  return <div className={styles.page}>
    {accounts.length === 0
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
              {accounts.map((account: any) => <div>
                {account?.id}
              </div>)}

              <Link className={styles.link} to={'/account/create'}>
                <div className={clsx(styles.createButton, styles.earthButton, styles.createAccountTableButton, styles.earthButtonTable)}>
                  <div>Create an Account </div>
                  <img className={styles.iconCopy}
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
