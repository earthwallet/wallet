import { earthProvider, providerManager, ethereumProvider } from './inject';

import { Script } from '~scripts/Provider/Script';

new Script().start();

inject(providerManager());
inject(earthProvider());
function injectEthereum(asset: string, name: string) {
  inject(
    ethereumProvider({
      name,
      asset,
      network: {
        networkId: 1,
        chainId: 1,
      },
      overrideEthereum: true,
    })
  );
}

//injectEthereum('ETH', 'eth');

function inject(content: string) {
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('async', 'false');
  scriptTag.textContent = `(() => {${content}})()`;
  container.insertBefore(scriptTag, container.children[0]);
}
