import { useState, useEffect } from 'react';
import { keyable } from '~scripts/Background/types/IMainController';
import { useController } from '~hooks/useController';
import { LIVE_SYMBOLS_GECKOIDs } from '~global/constant';
import { LIVE_TOKENS_GECKOIDs } from '~global/tokens';

export default function useGetAccountGroupBalances(accountGroups: keyable[][]) {
  const [loading, setLoading] = useState(false);
  const controller = useController();

  useEffect((): void => {
    accountGroups.length !== 0 &&
      controller.accounts.getBalancesOfAccountsGroup(accountGroups).then(() => {
        setLoading(true);
        controller.assets
          .fetchFiatPrices([...LIVE_SYMBOLS_GECKOIDs, ...LIVE_TOKENS_GECKOIDs])
          .then(() => {
            setLoading(false);
            controller.accounts.getTotalBalanceOfAccountGroup(accountGroups);
          });
      });
  }, [accountGroups.length]);

  return loading;
}
