import React, { useEffect, useState } from 'react';
import styles from './index.scss';
import ICON_CARET from '~assets/images/icon_caret.svg';
import ICON_FAILED from '~assets/images/icon_failed.svg';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import ICON_RECV from '~assets/images/icon_receive.svg';
import ICON_SEND from '~assets/images/icon_send_status.svg';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { getTransactions } from '@earthwallet/keyring';
import moment from 'moment-mini';
import { getShortAddress } from '~utils/common';
import { ClipLoader } from 'react-spinners';
import { selectAccountById } from '~state/wallet';
import { useSelector } from 'react-redux';
import { getSymbol } from '~utils/common';
import { selectAssetBySymbol, selectTxnRequestsByAddress } from '~state/assets';
import clsx from 'clsx';
import { getTokenImageUrlFromnftId } from '~global/nfts';
import { getTokenInfo } from '~global/tokens';
import { getTransactions_ETH_MATIC } from '~utils/services';
import { getTransactions_BTC_DOGE } from '~utils/btc';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ accountId: string }> {
  className?: string;
}
interface keyable {
  [key: string]: any;
}
const Transactions = ({
  match: {
    params: {
      accountId,
    },
  },
}: Props) => {

  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;

  const history = useHistory();
  const [walletTransactions, setWalletTransactions] = useState<any>({ txs: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol(selectedAccount?.symbol)?.coinGeckoId || ''));
  const usdValue = currentUSDValue?.usd;
  const txnReqs = useSelector(selectTxnRequestsByAddress(address));


  const getTransactionTime = (transaction: any): any => {
    const timestamp: number = transaction.transaction?.metadata?.timestamp;

    return moment(timestamp / 1000000).format('MMM DD YYYY');
  };
  const getTransactionTimestamp = (transaction: any): any => {
    const timestamp: number = (selectedAccount?.symbol == 'BTC' || selectedAccount?.symbol == 'DOGE') ? transaction.time : transaction.transaction?.metadata?.timestamp;

    return timestamp;
  };

  const loadTransactions = async (address: string) => {
    if (selectedAccount?.symbol == 'ICP') {
      setLoading(true);
      const transactions = await getTransactions(address, selectedAccount?.symbol);
      setLoading(false);
      setWalletTransactions(transactions);
    } else if (selectedAccount?.symbol == 'BTC' || selectedAccount?.symbol == 'DOGE') {
      setLoading(true);
      const response = await getTransactions_BTC_DOGE(address, selectedAccount?.symbol);
      const wallet = { txs: response, total: response?.length };
      setWalletTransactions(wallet);
      setLoading(false);
    } else {
      setLoading(true);
      const response = await getTransactions_ETH_MATIC(address, selectedAccount?.symbol);
      setLoading(false);
      const wallet = { txs: response, total: response?.length };
      setWalletTransactions(wallet);

    }
  };
  useEffect(() => {

    if (address) {
      loadTransactions(address);

    }
  }, [selectedAccount?.id !== undefined]);

  const TxnItem = ({ transaction, index, symbol }: { transaction: keyable, index: number, symbol: string }) => {


    const getTransactionDetailICP = (transaction: any): any => {
      const operations = transaction.transaction.operations
        .filter((operation: { type: string }) => operation.type === 'TRANSACTION')
        .filter(
          (operation: { account: any }) => operation.account.address === address
        );

      return operations[0];
    };
    const getTransactionWithDetailICP = (transaction: any): any => {
      const operations = transaction?.transaction?.operations?.filter((operation: { type: string }) => operation.type === 'TRANSACTION')
        .filter(
          (operation: { account: any }) => operation.account.address !== address
        );

      return operations[0];
    };

    if (symbol === 'BTC' || symbol === 'LTC' || symbol === 'BCH' || symbol == "DOGE") {

      const getAmount = (transaction: any): any => {
        return transaction.balance_change;
      };

      return <div
        className={styles.transItem}
        key={index}
        onClick={() => window.open(symbol === 'BCH' ? `https://www.blockchain.com/bch/tx/${transaction?.hash}` : `https://chain.so/tx/${symbol}/${transaction?.hash}`, "_blank")}
      >
        <div className={styles.transColIcon}>
          {statusToIcon(
            getAmount(transaction) > 0
              ? 'Receive'
              : 'Send'
          )}
        </div>
        <div className={styles.transColStatus}>
          <div>
            {getAmount(transaction) > 0
              ? 'Receive'
              : 'Send'}
          </div>
          <div className={styles.transSubColTime}>
            <div className={styles.transDate}>{`${moment.unix(transaction.time).format("MMM DD YY, h:mm:ss a")}`}</div>
          </div>
        </div>

        <div className={styles.transColValue}>
          <div>
            {getAmount(transaction)}
            {symbol}
          </div>
          <div className={styles.transSubColPrice}>
            ${(getAmount(transaction) * usdValue).toFixed(3)}
          </div>
        </div>
        <div className={styles.transColAction}>
          <img src={ICON_FORWARD} />
        </div>
      </div>
    }
    if (symbol === 'ETH' || symbol == 'MATIC') {
      return <div
        className={styles.transItem}
        key={index}
        onClick={() => window.open(symbol == 'MATIC' ? `https://polygonscan.com/tx/${transaction?.hash}` : `https://etherscan.io/tx/${transaction?.hash}`, "_blank")}
      >
        <div className={styles.transColIcon}>
          {statusToIcon(
            transaction.to == address
              ? 'Receive'
              : 'Send'
          )}
        </div>
        <div className={styles.transColStatus}>
          <div>
            {transaction.to == address
              ? 'Receive'
              : 'Send'}
          </div>
          <div className={styles.transSubColTime}>
            <div className={styles.transDate}>Block: {transaction.block}</div>
            <div className={styles.transSubColDot}></div>
            <div className={styles.transAddress}>
              {transaction.to == address ? 'from ' + getShortAddress(transaction.from, 3) : 'to ' + getShortAddress(transaction.to, 3)}
            </div>
          </div>
        </div>

        <div className={styles.transColValue}>
          <div>
            {transaction.value} {symbol}
          </div>
          <div className={styles.transSubColPrice}>
            ${(transaction.value * usdValue).toFixed(3)}
          </div>
        </div>
        <div className={styles.transColAction}>
          <img src={ICON_FORWARD} />
        </div>
      </div>
    }

    if (transaction.type == 'buyNft')
      return <div className={clsx(styles.transItem, styles.transItem_noclick)}
        key={index}>
        <div className={styles.transColIcon}>
          {transaction.loading
            ? <div><ClipLoader color={'#fffff'}
              size={10} /></div>
            : (transaction.error != '' && transaction.error != null) ? <img src={ICON_FAILED} />
              : transaction.current == transaction.total ? <img src={ICON_RECV} /> : ''}
        </div>
        <div className={styles.transColStatus}>
          <div className={styles.transFirstline}>
            {transaction.loading
              ? 'Buying..'
              : (transaction.error != '' && transaction.error != null)
                ? <div className={styles.errorText}>{transaction.error}</div>
                : transaction.current == transaction.total ? 'NFT Buy' : ''}
          </div>
          <div className={styles.transSubColTime}>
            <div>{getTransactionTime(transaction) || '-'}</div>
            <div className={styles.transSubColDot}></div>
            <div>
              {transaction.loading
                ? transaction.status
                : (transaction.error != '' && transaction.error != null)
                  ? <div>{'Error at ' + ['Making Offer', 'Transferring ICP', 'Settling'][transaction.current - 1]}</div>
                  : transaction.current == transaction.total ? 'Complete' : `At ${transaction.current} of ${transaction.total}`
              }
            </div>
          </div>
        </div>

        <div className={styles.transColValue}>
          <img
            src={getTokenImageUrlFromnftId(transaction.nftId)}
            className={styles.nftImage} />
        </div>
        <div className={clsx(styles.transColAction, styles.noop)}>
          <img src={ICON_FORWARD} />
        </div>
      </div>
    if (transaction.type == 'mint')
      return transaction.current == 0 ? <div></div> : <div className={clsx(styles.transItem, styles.transItem_noclick)}
        key={index}>
        <div className={styles.transColIcon}>
          {transaction.loading
            ? <div><ClipLoader color={'#fffff'}
              size={10} /></div>
            : (transaction.error != '' && transaction.error != null) ? <img src={ICON_FAILED} />
              : transaction.current == transaction.total ? <img src={ICON_RECV} /> : ''}
        </div>
        <div className={styles.transColStatus}>
          <div className={styles.transFirstline}>
            {transaction.loading
              ? 'Mint..'
              : (transaction.error != '' && transaction.error != null)
                ? <div className={styles.errorText}>{typeof transaction.error == 'string' ? transaction.error : '-'}</div>
                : transaction.current == transaction.total ? 'Mint' : ''}
          </div>
          <div className={styles.transSubColTime}>
            <div>{getTransactionTime(transaction) || '-'}</div>
            <div className={styles.transSubColDot}></div>
            <div>
              {transaction.loading
                ? transaction.status
                : (transaction.error != '' && transaction.error != null)
                  ? <div>{'Error at ' + ['Transferring ICP', 'Minting', 'Updating balances'][transaction.current - 1]}</div>
                  : transaction.current == transaction.total ? 'Complete' : `At ${transaction.current} of ${transaction.total}`
              }
            </div>
          </div>
        </div>

        <div className={styles.transColValue}>
          <div
            className={styles.nftImage} >{getTokenInfo(transaction.params.to).symbol}</div>
        </div>
        <div className={clsx(styles.transColAction, styles.noop)}>
          <img src={ICON_FORWARD} />
        </div>
      </div>

    return <div
      className={styles.transItem}
      key={index}
      onClick={() =>
        history.push(
          `/account/transaction/${transaction?.transaction?.transaction_identifier?.hash}`
        )
      }
    >
      <div className={styles.transColIcon}>
        {statusToIcon(
          (
            getTransactionDetailICP(transaction) &&
            getTransactionDetailICP(transaction).amount
          )?.value > 0
            ? 'Receive'
            : 'Send'
        )}
      </div>
      <div className={styles.transColStatus}>
        <div>
          {(
            getTransactionDetailICP(transaction) &&
            getTransactionDetailICP(transaction).amount
          ).value > 0
            ? 'Receive'
            : 'Send'}
        </div>
        <div className={styles.transSubColTime}>
          <div>{getTransactionTime(transaction) || '-'}</div>
          <div className={styles.transSubColDot}></div>
          <div>
            to{' '}
            {getShortAddress(
              getTransactionWithDetailICP(transaction)?.account
                .address || 'Self', 4
            )}
          </div>
        </div>
      </div>

      <div className={styles.transColValue}>
        <div>
          {(
            getTransactionDetailICP(transaction) &&
            getTransactionDetailICP(transaction).amount
          ).value /
            Math.pow(
              10,
              (
                getTransactionDetailICP(transaction) &&
                getTransactionDetailICP(transaction).amount
              ).currency.decimals
            )}{' '}
          ICP
        </div>
        <div className={styles.transSubColPrice}>
          $
          {(
            ((
              getTransactionDetailICP(transaction) &&
              getTransactionDetailICP(transaction).amount
            ).value /
              Math.pow(
                10,
                (
                  getTransactionDetailICP(transaction) &&
                  getTransactionDetailICP(transaction).amount
                ).currency.decimals
              )) *
            usdValue
          ).toFixed(3)}
        </div>
      </div>
      <div className={styles.transColAction}>
        <img src={ICON_FORWARD} />
      </div>
    </div>
  };


  const statusToIcon = (status: string) => {
    switch (status) {
      case 'Receive':
        return [<img src={ICON_RECV} />];
      case 'Send':
        return [<img src={ICON_SEND} />];
      case 'Failed':
        return [<img src={ICON_FAILED} />];
      default:
        return <div />;
    }
  };

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.transCont}>
        <div
          className={styles.backTransButton}
          onClick={() => history.goBack()}
        >
          <img src={ICON_CARET} />
          <div className={styles.transTitle}>{i18nT('wallet.txns')}</div>
        </div>
        <div className={styles.pageloading}>
          <ClipLoader color={'#fffff'}
            size={15} />
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.transCont}>
        <div
          className={styles.backTransButton}
          onClick={() => history.goBack()}
        >
          <img src={ICON_CARET} />

          <div className={styles.transTitle}>{i18nT('transactions.header')}{' '}({walletTransactions?.txs.length})</div>
        </div>

        {walletTransactions &&
          walletTransactions?.txs &&
          walletTransactions?.txs.length === 0
          ? <div className={styles.pageloading}>
            <div className={styles.noTrans}>{i18nT('transactions.noTxns')}</div>
          </div>
          : <div className={styles.transItems}>
            {walletTransactions &&
              walletTransactions?.txs &&
              [...txnReqs, ...walletTransactions?.txs]?.sort((a: keyable, b: keyable) =>
                getTransactionTimestamp(b) - getTransactionTimestamp(a)).map((transaction: keyable, index: number) =>
                  <TxnItem key={index} transaction={transaction} index={index} symbol={selectedAccount?.symbol} />)}
          </div>}
      </div>
    </div>
  );
};

export default withRouter(Transactions);