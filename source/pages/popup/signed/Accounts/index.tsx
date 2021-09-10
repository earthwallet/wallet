import React from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import ICON_ADD from '~assets/images/icon_add_account.svg';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectAccountGroups, selectGroupBalanceByAddress } from '~state/wallet';
import { useHistory } from 'react-router-dom';
import { keyable } from '~scripts/Background/types/IAssetsController';
import { getSymbol } from '~utils/common';
import useGetAccountGroupBalances from '~hooks/useGetAccountGroupBalances';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Page = () => {
  const history = useHistory();
  const accountGroups = useSelector(selectAccountGroups);
  const loading = useGetAccountGroupBalances(accountGroups);

  return (
    <div className={styles.page}>
      {accountGroups.length === 0 ? (
        <div>
          <div className={styles.subtitle}>bringing crypto back to earth</div>
          <div className={styles.noAccountsActions}>
            <div className={styles.earthButtonCont}>
              <Link className={styles.link} to={'/account/create'}>
                <div className={styles.earthButton}>Create an Account</div>
              </Link>
            </div>
            <div className={styles.footerCont}>
              <div className={styles.orSep}>or</div>
              <Link className={styles.link} to={'/account/import'}>
                <div className={styles.earthLink}>import seed phrase</div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <>
            <div className={styles.accountTitle}>Select Account</div>
            <div className={styles.accountsCont}>
              {accountGroups.map((accountGroup: any) => (
                <div key={accountGroup[0].id}>
                  <div className={styles.address}>
                    <div
                      className={styles.addressLink}
                      onClick={() => history.push('/account/details/' + accountGroup[0].id)}
                    >
                      <div className={styles.infoRow}>
                        <div className={styles.info}>
                          <div className={styles.name}>
                            <span>{accountGroup[0]?.meta?.name}</span>
                          </div>
                          <div className={styles.accountIcons}>
                            {accountGroup.map((account: keyable) =>
                              <img src={getSymbol(account.symbol)?.icon} className={styles.accountIcon} key={account.id} />
                            )}
                            {/* <span className={styles.fullAddress}>
                              {account.id}
                            </span> */}
                          </div>
                        </div>
                        <div className={styles.infoBalance}><GroupBalance loading={loading} groupId={accountGroup[0].groupId} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link className={styles.link} to={'/account/create'}>
                <div
                  className={clsx(
                    styles.createButton,
                    styles.earthButton,
                    styles.createAccountTableButton,
                    styles.earthButtonTable
                  )}
                >
                  <div>Create an Account </div>
                  <img className={styles.iconCopy} src={ICON_ADD} />
                </div>
              </Link>
            </div>
          </>
          <div className={styles.footerCont}>
            <div className={styles.orSep}>or</div>
            <Link className={styles.link} to={'/account/import'}>
              <div className={styles.earthLink}>import seed phrase</div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const GroupBalance = ({ groupId, loading }: { groupId: string, loading: boolean }) => {
  const currentBalance: keyable = useSelector(selectGroupBalanceByAddress(groupId));

  if (loading)
    return <SkeletonTheme color="#222" highlightColor="#000">
      <Skeleton width={60} />
    </SkeletonTheme>;

  return <div>${currentBalance?.balanceInUSD?.toFixed(3) || 0}</div>
}

export default Page;
