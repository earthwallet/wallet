import React from 'react';
import styles from './index.scss';
import { Link } from 'react-router-dom';
import ICON_ADD from '~assets/images/icon_add_account.svg';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectActiveAccountGroups, selectAssetsICPCountByAddress, selectGroupBalanceByAddress } from '~state/wallet';
import { useHistory } from 'react-router-dom';
import { keyable } from '~scripts/Background/types/IMainController';
import { getSymbol } from '~utils/common';
import useGetAccountGroupBalances from '~hooks/useGetAccountGroupBalances';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import useGetAccountGroupAssetBalances from '~hooks/useGetAccountGroupAssetBalances';

const Page = () => {
  const history = useHistory();
  const accountGroups = useSelector(selectActiveAccountGroups);
  const loading = useGetAccountGroupBalances(accountGroups);
  const assetLoading = useGetAccountGroupAssetBalances(accountGroups);
  console.log(assetLoading);

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
                            {accountGroup.sort((a: keyable, b: keyable) => a.order - b.order).map((account: keyable) =>
                              <img src={getSymbol(account.symbol)?.icon} className={styles.accountIcon} key={account.id} />
                            )}
                            <AssetsICPCount icpAddress={accountGroup.filter((account: keyable) => account.symbol === 'ICP')[0]?.address} />
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

const AssetsICPCount = ({ icpAddress }: { icpAddress: string }) => {
  const assetsObj: keyable = useSelector(selectAssetsICPCountByAddress(icpAddress));




  return <div className={styles.assetCount}>{assetsObj?.count === 0 ? '' : assetsObj?.count === 1 ? '1 NFT' : `${assetsObj?.count} NFTs`}
    {assetsObj.loading && <span className={styles.assetCountLoading}><SkeletonTheme color="#222" highlightColor="#000">
      <Skeleton width={20} />
    </SkeletonTheme>
    </span>}
  </div>
}

export default Page;
