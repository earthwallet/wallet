import { ethers } from 'ethers';
import { ALCHEMY_ETH_API_KEY, ALCHEMY_POLYGON_API_KEY } from '~global/config';
import { keyable } from '~scripts/Background/types/IAssetsController';
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

function combineKeysWithRecords(keys: any[], records: keyable) {
  const combined: keyable = {};
  keys.map((key, index) => {
    combined[key] = records[index];
  });
  return combined;
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

  /* fetchContractData(interestedKeys, tokenId).then((data) => {
    if (isEmpty(data.owner)) {
      return { errorMessage: 'Domain is not registered', error: true };
    }

    if (isEmpty(data.resolver)) {
      return { errorMessage: 'Domain is not registered', error: true };
    }

    return {
      ownerAddress: data.owner,
      resolverAddress: data.resolver,
      records: combineKeysWithRecords(interestedKeys, data[2]),
    };
  }); */
};

export const unsResolveName = async (domain: string) => {
  const proxyReaderAddress = '0xfEe4D4F0aDFF8D84c12170306507554bC7045878';
  // Partial ABI, just for the getMany function.
  const proxyReaderAbi = [
    'function getMany(string[] calldata keys, uint256 tokenId) external view returns (string[] memory)',
  ];

  const provider = (symbol: string) =>
    new ethers.providers.AlchemyProvider(
      symbol == 'MATIC' ? 'matic' : 'homestead',
      symbol == 'MATIC' ? ALCHEMY_POLYGON_API_KEY : ALCHEMY_ETH_API_KEY
    );
  const proxyReaderContract = new ethers.Contract(
    proxyReaderAddress,
    proxyReaderAbi,
    provider('ETH')
  );

  const tokenId = namehash(domain);
  const keys = ['crypto.ETH.address'];

  const values = await proxyReaderContract.getMany(keys, tokenId);

  return values;
};
