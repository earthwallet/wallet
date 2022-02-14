import { useState, useEffect } from 'react';
//import { keyable } from '~scripts/Background/types/IMainController';
import { useController } from '~hooks/useController';

export default function useGetCollectionStats() {
  const [loading, setLoading] = useState(false);
  const controller = useController();

  useEffect((): void => {
    setLoading(true);

    controller.assets.getCollectionStats().then(() => {
      setLoading(false);
    });
  }, []);

  return loading;
}
