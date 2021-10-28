const providerManager = () => `
class InjectedProvider {
  constructor (asset) {
    this.asset = asset
  }

  setClient () {}

  getMethod (method) {
    return (...args) => window.providerManager.proxy('CAL_REQUEST', {
      asset: this.asset,
      method,
      args
    })
  }
}

class ProviderManager {
  constructor () {
    this.cache = {}
  }

  proxy (type, data) {
    return new Promise((resolve, reject) => {
      const id = Date.now() + '.' + Math.random()
  
      window.addEventListener(id, ({ detail }) => {
        const response = JSON.parse(detail)
        if (response.error) reject(new Error(response.error))
        else resolve(response.result)
      }, {
        once: true,
        passive: true
      })
  
      window.postMessage({
        id,
        type,
        data
      }, '*')
    })
  }

  getProviderFor (asset) {
    if (this.cache[asset]) return this.cache[asset]

    this.cache[asset] = new InjectedProvider(asset)

    return this.cache[asset]
  }

  enable () {
    return this.proxy('ENABLE_REQUEST')
  }
}

window.providerManager = new ProviderManager()
`;

// @ts-ignore
const ethereumProvider = ({
  name,
  asset,
  network,
  overrideEthereum = false,
}: {
  name: any;
  asset: any;
  network: any;
  overrideEthereum: boolean;
}) => `
async function getAddresses () {
  const eth = window.providerManager.getProviderFor('${asset}')
  let addresses = await eth.getMethod('wallet.getAddresses')()
  addresses = addresses.map(a => '0x' + a.address)
  return addresses
}

async function handleRequest (req) {
  const eth = window.providerManager.getProviderFor('${asset}')
  if(req.method.startsWith('metamask_')) return null

  if(req.method === 'eth_requestAccounts') {
    return await window.${name}.enable()
  }
  if(req.method === 'personal_sign') { 
    const sig = await eth.getMethod('wallet.signMessage')(req.params[0], req.params[1])
    return '0x' + sig
  }
  if(req.method === 'eth_sendTransaction') {
    const to = req.params[0].to
    const value = req.params[0].value
    const data = req.params[0].data
    const gas = req.params[0].gas
    const result = await eth.getMethod('chain.sendTransaction')({ to, value, data, gas })
    return '0x' + result.hash
  }
  if(req.method === 'eth_accounts') {
    return getAddresses()
  }
  return eth.getMethod('jsonrpc')(req.method, ...req.params)
}

window.${name} = {
  isLiquality: true,
  isEIP1193: true,
  networkVersion: '${network.networkId}',
  chainId: '${network.chainId.toString(16)}',
  enable: async () => {
    const accepted = await window.providerManager.enable()
    if (!accepted) throw new Error('User rejected')
    return getAddresses()
  },
  request: async (req) => {
    const params = req.params || []
    return handleRequest({
      method: req.method, params
    })
  },
  send: async (req, _paramsOrCallback) => {
    if (typeof _paramsOrCallback === 'function') {
      window.${name}.sendAsync(req, _paramsOrCallback)
      return
    }
    const method = typeof req === 'string' ? req : req.method
    const params = req.params || _paramsOrCallback || []
    return handleRequest({ method, params })
  },
  sendAsync: (req, callback) => {
    handleRequest(req)
      .then((result) => callback(null, {
        id: req.id,
        jsonrpc: '2.0',
        result
      }))
      .catch((err) => callback(err))
  },
  on: (method, callback) => {}, // TODO
  autoRefreshOnNetworkChange: false
}

${
  overrideEthereum
    ? `function override() {
    window.ethereum = window.${name}
  }

  if (!window.ethereum) {
    override()
    const retryLimit = 5
    let retries = 0
    const interval = setInterval(() => {
      retries++
      if (window.ethereum && !window.ethereum.isLiquality) {
        override()
        clearInterval(interval)
      }
      if (retries >= retryLimit) clearInterval(interval)
    }, 1000)
  } else {
    override()
  }`
    : ''
}
`;

const earthProvider = () => `

const REQUEST_MAP = {
  isConnected: 'wallet.isConnected',
  getNetwork: 'wallet.getNetwork',
  getAddress: 'wallet.getAddress',
  getBalance: 'wallet.getBalance',
  signMessage: 'wallet.signMessage',
  sendTransaction: 'wallet.sendTransaction',
}

async function handleRequest (req) {
  const icp = window.providerManager.getProviderFor('ICP')
  if (req.method === 'wallet_sendTransaction') {
    const to = req.params[0].to
    const value = req.params[0].value.toString(16)
    return icp.getMethod('wallet.sendTransaction')({ to, value })
  }
  const method = REQUEST_MAP[req.method] || req.method
  console.log(method, ...req.params);
  return icp.getMethod(method)(...req.params)
}

window.earth = {
  evtRegMap: {},
  version: '1.1',
  isConnected: async () => {
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.isConnected')()
  },
  signMessage: async (params) => {
    console.log(params);
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.signMessage')(params)
  },
  enable: async () => {
    const accepted = await window.providerManager.enable()
    if (!accepted) throw new Error('User rejected')
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.getAddress')()
  },
  reset: async () => {
    const accepted = await window.providerManager.enable()
    if (!accepted) throw new Error('User rejected')
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.getAddress')()
  },
  request: async (req) => {
    const params = req.params || []
    return handleRequest({
      method: req.method, params
    })
  },
  on: (method, callback) => {
    const id = Date.now() + '.' + Math.random();
    
    window.earth.evtRegMap[id] = callback;

    window.addEventListener(id, ({detail}) => {
      const rCallback = window.earth.evtRegMap[id];
      if (rCallback) {
        rCallback(JSON.parse(detail));
      }
    })

    window.postMessage({ id, type: 'EARTH_EVENT_MESSAGE', data: { method } }, '*')
  }
}
`;

export { providerManager, ethereumProvider, earthProvider };
