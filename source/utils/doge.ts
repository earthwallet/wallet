import * as Bitcoin from 'bitcoinjs-lib';

export const dogeNetwork: Bitcoin.Network = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
  bech32: '',
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  wif: 0x9e,
  // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
};
export const DOGE_SLIP_PATH = `m/44'/3'/0'/0/0`;
