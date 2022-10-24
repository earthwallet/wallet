import { isHex } from 'web3-utils';
import { DEFAULT_SYMBOLS } from '~global/constant';
import { keyable } from '~scripts/Background/types/IAssetsController';

const randomColorArray = [
  '#FEE05F',
  '#F5836B',
  '#EE6C89',
  '#ff7997',
  '#397893',
  '#f48fb1',
  '#397893',
  '#F0512A',
  '#ff80ab',
  '#ff4081',
  '#ce93d8',
  '#ba68c8',
  '#ab47bc',
  '#ea80fc',
  '#5c6bc0',
  '#3f51b5',
  '#8c9eff',
  '#AF71AF',
  '#966EAC',
  '#91a7ff',
  '#738ffe',
  '#ECCCDB',
  '#6889ff',
  '#4d73ff',
  '#80deea',
  '#FFA800',
  '#26c6da',
  '#00bcd4',
  '#84ffff',
  '#D6234A',
  '#00e5ff',
  '#80cbc4',
  '#4db6ac',
  '#26a69a',
  '#009688',
  '#F78D53',
  '#1de9b6',
  '#00bfa5',
  '#72d572',
  '#42bd41',
  '#397893',
  '#a2f78d',
  '#e6ee9c',
  '#dce775',
  '#d4e157',
  '#ffee58',
  '#B24594',
  '#ffd54f',
  '#ffca28',
  '#FFBB50',
  '#397893',
  '#9195C9',
  '#ffcc80',
  '#ffb74d',
  '#ffa726',
  '#ffd180',
  '#ffab40',
  '#ff9100',
  '#FF5A5A',
  '#ffab91',
  '#ff8a65',
  '#ff9e80',
  '#ff6e40',
  '#bcaaa4',
  '#a1887f',
  '#8d6e63',
  '#90a4ae',
  '#78909c',
  '#607d8b',
];

function hashStr(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    hash += str.charCodeAt(i);
  }

  return hash;
}

const generateRandomColor = (str: string) => {
  if (str == null || str?.trim() === '') {
    return randomColorArray[
      Math.floor(Math.random() * randomColorArray.length)
    ];
  }

  const index = hashStr(str) % randomColorArray.length;

  return randomColorArray[index];
};

export const getShortAddress = (address: string, size = 6) =>
  address?.substring(0, size) +
  '...' +
  address?.substring(address.length - size - 1);

export const getShortText = (text: string, count: number) => {
  return text.slice(0, count) + (text.length > count ? '...' : '');
};

export const getSymbol = (symbol: string) => {
  return DEFAULT_SYMBOLS.find((o) => o.symbol === symbol);
};

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

export const serializeJsonWithBigInt = (data: keyable): string =>
  JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  );

export const deSerializeJsonWithBigInt = (json: string): keyable =>
  JSON.parse(json, (_, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.substring(0, value.length - 1)).toString();
    }
    return value;
  });

export const parseBigIntToString = (data: keyable): keyable =>
  deSerializeJsonWithBigInt(serializeJsonWithBigInt(data));

export default generateRandomColor;

export const PASSWORD_MIN_LENGTH = 6;

function hexToBn(hex: string) {
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  var highbyte = parseInt(hex.slice(0, 2), 16);
  var bn = BigInt('0x' + hex);

  if (0x80 & highbyte) {
    // bn = ~bn; WRONG in JS (would work in other languages)

    // manually perform two's compliment (flip bits, add one)
    // (because JS binary operators are incorrect for negatives)
    bn =
      BigInt(
        '0b' +
          bn
            .toString(2)
            .split('')
            .map(function (i) {
              return '0' === i ? 1 : 0;
            })
            .join('')
      ) + BigInt(1);
    // add the sign character to output string (bytes are unaffected)
    bn = -bn;
  }

  return bn;
}

export function convertHexToNumberIfPossible(hex: string) {
  try {
    return isHex(hex)
      ? hexToBn(hex.substring(2)).toString()
      : hexToBn(hex).toString();
  } catch (e) {
    return hex;
  }
}

function hexToUtf8(s: string) {
  return decodeURIComponent(
    s
      .replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
  );
}

export function convertHexToUtf8IfPossible(hex: string) {
  try {
    return hexToUtf8(hex);
  } catch (e) {
    return hex;
  }
}
export function renderEthereumRequests(
  method: string,
  request: keyable,
  address: string
) {
  let params = [{ label: 'Method', value: method }];

  switch (method) {
    case 'eth_sendTransaction':
    case 'eth_signTransaction':
      params = [
        ...params,
        { label: 'From', value: request.from },
        { label: 'To', value: request.to },
        {
          label: 'Gas Limit',
          value: request.gas
            ? convertHexToNumberIfPossible(request.gas)
            : request.gasLimit
            ? convertHexToNumberIfPossible(request.gasLimit)
            : '',
        },
        ...(request.gasPrice
          ? [
              {
                label: 'Gas Price',
                value:
                  (request.gasPrice &&
                    convertHexToNumberIfPossible(request.gasPrice)) ||
                  '?',
              },
            ]
          : []),
        ...(request.nonce
          ? [
              {
                label: 'Nonce',
                value: convertHexToNumberIfPossible(request.nonce),
              },
            ]
          : []),
        ...(request.maxFeePerGas
          ? [
              {
                label: 'Max Fee Per Gas',
                value: convertHexToNumberIfPossible(request.maxFeePerGas),
              },
            ]
          : []),
        ...(request.maxPriorityFeePerGas
          ? [
              {
                label: 'Max Priority Fee Per Gas',
                value: convertHexToNumberIfPossible(
                  request.maxPriorityFeePerGas
                ),
              },
            ]
          : []),
        {
          label: 'Value',
          value: request.value
            ? convertHexToNumberIfPossible(request.value)
            : '',
        },
        { label: 'Data', value: request.data },
      ];
      break;

    case 'eth_sign':
      params = [
        ...params,
        { label: 'Address', value: address },
        { label: 'Message', value: JSON.stringify(request) },
      ];
      break;
    case 'personal_sign':
      params = [
        ...params,
        { label: 'Address', value: address },
        {
          label: 'Message',
          value:
            typeof request == 'string'
              ? convertHexToUtf8IfPossible(request)
              : JSON.stringify(request),
        },
      ];
      break;
    default:
      params = [
        ...params,
        {
          label: 'params',
          value: JSON.stringify(request, null, '\t'),
        },
      ];
      break;
  }
  return params;
}
