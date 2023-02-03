import axios, { AxiosRequestConfig } from 'axios';
import { ethers } from 'ethers';
import { ALCHEMY_ETH_API_KEY, ALCHEMY_POLYGON_API_KEY, UNSTOPPABLE_DOMAIN_API } from '~global/config';
import { keyable } from '~scripts/Background/types/IMainController';
const keccak_256 = require('js-sha3').keccak256;

const address = '0xfee4d4f0adff8d84c12170306507554bc7045878';
const address_matic = `0xa3f32c8cd786dc089bd1fc175f2707223aee5d00`;
const abi = [
  {
    constant: true,
    inputs: [
      {
        internalType: 'string[]',
        name: 'keys',
        type: 'string[]',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getData',
    outputs: [
      {
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'values',
        type: 'string[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
async function fetchContractData(keys: any, tokenId: any, symbol: string) {
  const provider = new ethers.providers.AlchemyProvider(
    symbol == 'MATIC' ? 'matic' : 'homestead',
    symbol == 'MATIC' ? ALCHEMY_POLYGON_API_KEY : ALCHEMY_ETH_API_KEY
  );
  var ethContract = new ethers.Contract(address, abi, provider);
  var maticContract = new ethers.Contract(address_matic, abi, provider);

  return symbol == 'MATIC'
    ? ethContract.getData(keys, tokenId)
    : maticContract.getData(keys, tokenId);
}

function namehash(name: any) {
  const hashArray = hash(name);
  return arrayToHex(hashArray);
}

// @ts-ignore
function hash(name) {
  if (!name) {
    return new Uint8Array(32);
  }
  const [label, ...remainder] = name.split('.');
  const labelHash = keccak_256.array(label);
  // @ts-ignore
  const remainderHash = hash(remainder.join('.'));
  return keccak_256.array(new Uint8Array([...remainderHash, ...labelHash]));
}

function arrayToHex(arr: any) {
  return (
    '0x' +
    Array.prototype.map
      .call(arr, (x) => ('00' + x.toString(16)).slice(-2))
      .join('')
  );
}

function isEmpty(msg: string) {
  return !msg || msg === '0x0000000000000000000000000000000000000000';
}

async function resolveEthNetwork(tokenId: any, interestedKeys: any) {
  return fetchContractData(interestedKeys, tokenId, 'ETH').then((data) => {
    return {
      ownerAddress: data.owner,
      resolverAddress: data.resolver,
      records: data[2],
    };
  });
}
async function resolveBothChains(tokenId: string, interestedKeys: string[]) {
  // try to resolve the polygon network first
  return fetchContractData(interestedKeys, tokenId, 'MATIC').then((data) => {
    if (isEmpty(data.owner)) {
      // if no owner for domain found on polygon network look up the eth network
      return resolveEthNetwork(tokenId, interestedKeys);
    }
    // proceed with polygon results
    return {
      ownerAddress: data.owner,
      resolverAddress: data.resolver,
      records: data[2],
    };
  });
}

export const resolveUNS = (userInput: string) => {
  const tokenId = namehash(userInput);

  const interestedKeys = ['crypto.BTC.address', 'crypto.ETH.address'];

  return resolveBothChains(tokenId, interestedKeys);

};

export const unsResolveName = async (
  domain: string,
  symbol: string,
  type?: string
) => {
  const proxyReaderAddress = '0x1BDc0fD4fbABeed3E611fd6195fCd5d41dcEF393';
  const maticProxyReaderAddress = '0x3E67b8c702a1292d1CEb025494C84367fcb12b45';

  // Partial ABI, just for the getMany function.
  const proxyReaderAbi = [
    'function getMany(string[] calldata keys, uint256 tokenId) external view returns (string[] memory)',
  ];

  const provider = (_symbol: string) =>
    new ethers.providers.AlchemyProvider(
      _symbol == 'MATIC' ? 'matic' : 'homestead',
      _symbol == 'MATIC' ? ALCHEMY_POLYGON_API_KEY : ALCHEMY_ETH_API_KEY
    );
  const proxyReaderContract = (_symbol: string) =>
    new ethers.Contract(
      _symbol == 'ETH' ? proxyReaderAddress : maticProxyReaderAddress,
      proxyReaderAbi,
      provider(_symbol)
    );

  const tokenId = namehash(domain);
  const keys = [
    symbol == 'MATIC'
      ? type == 'ERC20' || type == 'token'
        ? 'crypto.MATIC.version.ERC20.address'
        : 'crypto.MATIC.version.MATIC.address'
      : `crypto.${symbol}.address`,
  ];

  const values = await proxyReaderContract('ETH').getMany(keys, tokenId);
  const maticValues = await proxyReaderContract('MATIC').getMany(keys, tokenId);

  return [...values, ...maticValues].filter((a) => a);
};

export const unsResolveAddress = async (address: string, symbol: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url:
      symbol == 'MATIC'
        ? `https://resolve.unstoppabledomains.com/domains?resolution%5Bcrypto.MATIC.version.MATIC.address%5D=${address?.toLowerCase()}`
        : `https://resolve.unstoppabledomains.com/domains?resolution%5Bcrypto.${symbol}.address%5D=${address?.toLowerCase()}`,
    headers: {
      Authorization: `Bearer ${UNSTOPPABLE_DOMAIN_API}`,
    },
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
    console.log(error, 'unsResolveAddress');
    return [];
  }

  return serverRes?.data?.map((a:keyable) => a?.attributes?.meta?.domain);
};
