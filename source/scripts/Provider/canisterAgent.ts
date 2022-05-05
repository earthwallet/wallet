// @ts-nocheck
import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { sha224 } from '@dfinity/rosetta-client/lib/hash';
import fetch from 'cross-fetch';

export { address_to_hex } from '@dfinity/rosetta-client';
import { Principal } from '@dfinity/principal';
import { ICP_HOST, DIDJS_ID, IC_ROCKS_HOST } from './constants';
import { default as DIDJS } from './candid/didjs.did';

import { Identity } from '@dfinity/agent';
import { address_to_hex } from '@dfinity/rosetta-client';
import { IDL } from '@dfinity/candid';
import NNS_CANISTERS from './candid/nns';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { blobFromText, blobFromUint8Array } from '@dfinity/candid';
import { Certificate } from '@dfinity/agent';
import cbor from 'borc';
class CanisterActor extends Actor {
  [x: string]: (...args: unknown[]) => Promise<unknown>;
}

export const decoder = new cbor.Decoder({
  tags: {
    55799: (val: any) => val,
  },
} as any);

const getSubAccountArray = (s) => {
  return Array(28)
    .fill(0)
    .concat(to32bits(s ? s : 0));
};
const to32bits = (num) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const SUB_ACCOUNT_ZERO = Buffer.alloc(32);
export const ACCOUNT_DOMAIN_SEPERATOR = Buffer.from('\x0Aaccount-id');

export const principal_id_to_address_buffer = (pid) => {
  return sha224([
    ACCOUNT_DOMAIN_SEPERATOR,
    pid.toUint8Array(),
    SUB_ACCOUNT_ZERO,
  ]);
};

export const getTokenImageExt = (canisterId: string, tokenid: string) =>
  `https://${canisterId}.raw.ic0.app/?tokenid=${tokenid}`;

export const getTokenThumbnailImageExt = (
  canisterId: string,
  tokenid: string
) => `https://${canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${tokenid}`;

export const principal_to_address = (principal) =>
  address_to_hex(principal_id_to_address_buffer(principal));

export const getTokenIdentifier = (
  canisterId: string,
  index: number
): string => {
  const padding = Buffer.from('\x0Atid');
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(canisterId).toUint8Array(),
    ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};

export const isHex = (str) => {
  return Boolean(str.match(/^[0-9a-f]+$/i));
};

export const validateAddress = (a) => {
  return isHex(a) && a.length === 64;
};

export const validatePrincipal = (p) => {
  try {
    return p === Principal.fromText(p).toText();
  } catch (e) {
    return false;
  }
};

export const principalTextoAddress = (p: string) => {
  return principal_to_address(Principal.fromText(p));
};

export const candidToJs = async (candid: string) => {
  const agent = await Promise.resolve(
    new HttpAgent({
      host: ICP_HOST,
      fetch,
    })
  ).then(async (ag) => {
    await ag.fetchRootKey();
    return ag;
  });

  const API = Actor.createActor(DIDJS, {
    agent,
    canisterId: DIDJS_ID,
  });
  const js: any = await API.did_to_js(candid);
  if (js === []) {
    return undefined;
  }
  return js[0];
};

export async function fetchJsFromLocalCanisterId(
  canisterId: string,
  host: string
): Promise<undefined | string> {
  const url = `${host}/_/candid?canisterId=${canisterId}&format=js`;
  const response = await fetch(url);
  if (!response.ok) {
    const common_interface: IDL.InterfaceFactory = ({ IDL }) =>
      IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
      });
    const agent = await Promise.resolve(
      new HttpAgent({
        host: host ? host : ICP_HOST,
        fetch,
      })
    ).then(async (ag) => {
      await ag.fetchRootKey();
      return ag;
    });
    const actor: ActorSubclass = Actor.createActor(common_interface, {
      agent,
      canisterId,
    });
    const candid_source =
      (await actor.__get_candid_interface_tmp_hack()) as string;
    const js = candidToJs(candid_source);
    return js;
  }
  return response.text();
}
export async function fetchJsFromCanisterId(
  canisterId: string,
  host?: string
): Promise<undefined | string> {
  let candid_source: any;

  if (canisterId in NNS_CANISTERS) {
    return null;
  } else {
    const agent = await Promise.resolve(
      new HttpAgent({
        host: host ? host : ICP_HOST,
        fetch,
      })
    ).then(async (ag) => {
      await ag.fetchRootKey();
      return ag;
    });

    const common_interface: IDL.InterfaceFactory = ({ IDL }) =>
      IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
      });
    const actor: CanisterActor = Actor.createActor(common_interface, {
      agent,
      canisterId,
    });
    candid_source = await actor.__get_candid_interface_tmp_hack();
  }

  const js: any = await candidToJs(candid_source);
  return js;
}

export async function fetchJsFromCanisterIdWithIcRocks(
  canisterId: string
): Promise<undefined | string> {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const data = await fetch(
    IC_ROCKS_HOST + `api/canisters/${canisterId}`,
    requestOptions as RequestInit
  ).then((response) => response.json());

  let candidString = data?.module?.candid;

  if (candidString === '') {
    candidString = await fetch(
      IC_ROCKS_HOST + `/data/interfaces/${data?.principal?.name}.did`,
      requestOptions as RequestInit
    ).then((response) => response.text());
  }
  const js: string = await candidToJs(candidString);

  return js;
}

export const canisterAgent = async ({
  canisterId,
  method,
  args,
  fromIdentity,
  host,
}: {
  canisterId: string;
  method: string;
  args?: any;
  fromIdentity?: any;
  host?: string;
}) => await canisterAgentApi(canisterId, method, args, fromIdentity, host);

export const canisterAgentApi = async (
  canisterId: string,
  methodName: string,
  args?: any,
  fromIdentity?: Identity,
  host?: string
) => {
  let agent;
  if (fromIdentity === null) {
    agent = await Promise.resolve(
      new HttpAgent({
        host: host ? host : ICP_HOST,
        fetch,
      })
    ).then(async (ag) => {
      await ag.fetchRootKey();
      return ag;
    });
  } else {
    agent = await Promise.resolve(
      new HttpAgent({
        host: host ? host : ICP_HOST,
        fetch,
        identity: fromIdentity,
      })
    ).then(async (ag) => {
      await ag.fetchRootKey();
      return ag;
    });
  }

  let candid: any;
  try {
    if (host != undefined) {
      const js = await fetchJsFromLocalCanisterId(canisterId, host);
      const dataUri =
        'data:text/javascript;charset=utf-8,' + encodeURIComponent(js);
      candid = await eval('import("' + dataUri + '")');
    } else {
      if (!(canisterId in NNS_CANISTERS)) {
        const js = await fetchJsFromCanisterId(canisterId);
        const dataUri =
          'data:text/javascript;charset=utf-8,' + encodeURIComponent(js);
        candid = await eval('import("' + dataUri + '")');
      } else {
        candid = await import(`./candid/${NNS_CANISTERS[canisterId]}.did`);
      }
    }
  } catch (_error) {
    console.log({ type: 'error', message: _error });
    return { type: 'error', message: _error };
  }

  function transform(_methodName: string, args: unknown[]) {
    const first = args[0] as any;
    const MANAGEMENT_CANISTER_ID = Principal.fromText('aaaaa-aa');
    let effectiveCanisterId = MANAGEMENT_CANISTER_ID;
    if (first && typeof first === 'object' && first.canister_id) {
      effectiveCanisterId = Principal.from(first.canister_id as unknown);
    }
    return { effectiveCanisterId };
  }

  let API;

  if (canisterId === 'aaaaa-aa') {
    API = Actor.createActor(candid?.default || candid?.idlFactory, {
      agent,
      canisterId: Principal.fromText(canisterId),
      ...{
        callTransform: transform,
        queryTransform: transform,
      },
    });
  } else {
    API = Actor.createActor(candid?.default || candid?.idlFactory, {
      agent,
      canisterId: canisterId,
    });
  }

  let response: any;
  try {
    if (args === undefined) {
      response = await API[methodName]();
    } else {
      response = await API[methodName](args);
    }
    return response;
  } catch (error) {
    if (
      error?.message == 'Wrong number of message arguments' &&
      Array.isArray(args)
    ) {
      response = await API[methodName](...args);
      return response;
    } else {
      console.log(error);
      return { type: 'error', message: error?.message };
    }
  }
};

export const decodeTokenId = (tid: string) => {
  const toHexString = (byteArray) => {
    return Array.from(byteArray, function (byte: any) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
  };
  const from32bits = (ba) => {
    let value;
    for (let i = 0; i < 4; i++) {
      value = (value << 8) | ba[i];
    }
    return value;
  };
  const p = [...Principal.fromText(tid).toUint8Array()];
  const padding = p.splice(0, 4);
  if (toHexString(padding) !== toHexString(Buffer.from('\x0Atid'))) {
    return {
      index: 0,
      canister: tid,
      token: getTokenIdentifier(tid, 0),
    };
  } else {
    return {
      index: from32bits(p.splice(-4)),
      // @ts-ignore
      canister: Principal.fromUint8Array(p as Uint8Array).toText(),
      token: tid,
    };
  }
};

export const getEd25519KeyIdentityFromPem = (pem) => {
  //https://github.com/Psychedelic/dfx-key/blob/cbbebb8419afa97a02861830b8ba598b4bf859da/plug.js
  // GNU GENERAL PUBLIC LICENSE Version 3
  pem = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace('\n', '')
    .trim();

  const raw = Buffer.from(pem, 'base64')
    .toString('hex')
    .replace('3053020101300506032b657004220420', '')
    .replace('a123032100', '');

  // including private key (32 bytes before public key)
  // and public key (last 32 bytes)
  const key = new Uint8Array(Buffer.from(raw, 'hex'));

  const identity = Ed25519KeyIdentity.fromSecretKey(key);

  return identity;
};

export function getSecp256k1IdentityFromPem(pem) {
  //https://github.com/Psychedelic/dfx-key/blob/cbbebb8419afa97a02861830b8ba598b4bf859da/plug.js
  // GNU GENERAL PUBLIC LICENSE Version 3

  const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----';
  const PEM_END = '-----END PRIVATE KEY-----';

  const PRIV_KEY_INIT =
    '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';

  const KEY_SEPARATOR = 'a144034200';
  pem = pem.replace(PEM_BEGIN, '');
  pem = pem.replace(PEM_END, '');
  pem = pem.replace('\n', '');

  const pemBuffer = Buffer.from(pem, 'base64');
  const pemHex = pemBuffer.toString('hex');

  const keys = pemHex.replace(PRIV_KEY_INIT, '');
  const [privateKey, publicKey] = keys.split(KEY_SEPARATOR);
  const identity = Secp256k1KeyIdentity.fromParsedJson([publicKey, privateKey]);
  return identity;
}
export const getCanisterInfo = async (canisterId: string) => {
  const agent = new HttpAgent({ host: ICP_HOST, fetch });
  const principal = blobFromUint8Array(
    Principal.fromText(canisterId).toUint8Array()
  );
  const pathCommon = [blobFromText('canister'), principal];
  const pathModuleHash = pathCommon.concat(blobFromText('module_hash'));
  const pathControllers = pathCommon.concat(blobFromText('controllers'));

  const res = await agent.readState(canisterId, {
    paths: [pathModuleHash, pathControllers],
  });

  const cert = new Certificate(res, agent);
  await cert.verify();
  const moduleHash = cert.lookup(pathModuleHash)?.toString('hex');
  const subnet = cert['cert'].delegation
    ? Principal.fromUint8Array(cert['cert'].delegation.subnet_id).toText()
    : null;
  const certControllers = cert.lookup(pathControllers);
  const controllers = decoder
    .decodeFirst(certControllers)
    .map((buf: Buffer) => Principal.fromUint8Array(buf).toText());

  return { moduleHash, subnet, controllers };
};
