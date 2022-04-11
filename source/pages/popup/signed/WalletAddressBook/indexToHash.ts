const indexToHash = async (index: BigInt | number) => {
  const fetchHeaders = new Headers();
  fetchHeaders.append('cache-control', 'no-cache');
  fetchHeaders.append('accept', 'application/json, text/plain, */*');
  fetchHeaders.append('content-type', 'application/json;charset=UTF-8');

  const raw = {
    network_identifier: {
      blockchain: 'Internet Computer',
      network: '00000000000000020101',
    },
    block_identifier: { index: Number(index) },
  };
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow',
  };

  const hashObj = await fetch(
    'https://rosetta-api.internetcomputer.org/block',
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => error);

  return hashObj?.block?.transactions[0]?.transaction_identifier?.hash;
};

export default indexToHash;
