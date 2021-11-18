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

  connect () {
    return this.proxy('CONNECT_REQUEST')
  }
}

window.providerManager = new ProviderManager()
`;

const earthProvider = () => `

const REQUEST_MAP = {
  isConnected: 'wallet.isConnected',
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
  version: '4.1',
  isConnected: async () => {
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.isConnected')()
  },
  getAddressMeta: async () => {
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.getAddressMeta')()
  },
  sign: async (params) => {
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.sign')(params)
  },
  signRaw: async (params) => {
    const icp = window.providerManager.getProviderFor('ICP')
    return icp.getMethod('wallet.signRaw')(params)
  },
  connect: async () => {
    const accepted = await window.providerManager.connect()
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

export { providerManager, earthProvider };
