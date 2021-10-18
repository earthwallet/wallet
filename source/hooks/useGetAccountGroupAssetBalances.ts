import { useState, useEffect } from 'react';
import { keyable } from '~scripts/Background/types/IMainController';
import { useController } from '~hooks/useController';

export default function useGetAccountGroupAssetBalances(
  accountGroups: keyable[][]
) {
  const [loading, setLoading] = useState(false);
  const controller = useController();

  useEffect((): void => {
    setLoading(true);

    accountGroups.length !== 0 &&
      controller.assets.getAssetsOfAccountsGroup(accountGroups).then(() => {
        setLoading(false);
      });
  }, [accountGroups.length]);

  return loading;
}
