[![Telegram](https://img.shields.io/badge/Live_Support-2CA5E0?style=flat&logo=telegram&logoColor=white)](https://t.me/earthwallet)
[![Discord](https://img.shields.io/badge/Developers-%237289DA.svg?style=flat&logo=discord&logoColor=white)](https://discord.gg/aemgEpMye3)
[![Twitter](https://img.shields.io/badge/Updates-%231DA1F2.svg?style=flat&logo=Twitter&logoColor=white)](https://twitter.com/earthwallet)
![License](https://img.shields.io/npm/l/sdk?color=blueviolet)
[![SDK](https://img.shields.io/npm/v/@earthwallet/sdk?color=brightgreen)](https://www.npmjs.com/package/@earthwallet/sdk)

![Earth Wallet](https://i.imgur.com/eIZaUbx.png)

Earth Wallet is a next generation self custody wallet built for the Internet Computer and other next generation blockchains and protocols. Designed and developed from the ground up to make the transition to next generation of the internet as seamless as possible while giving you super powers that other self-custody wallets don't have! Join the mission to bring crypto back to Earth with the worlds best open source, secure, decentralized wallet and create a better planet for all life on Earth.

## Browser Support

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](/) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](/) | [![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](/) | [![Yandex](https://raw.github.com/alrra/browser-logos/master/src/yandex/yandex_48x48.png)](/) | [![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png)](/) | [![vivaldi](https://raw.github.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png)](/) |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 49 & later ✔                                                                                  | 52 & later ✔                                                                                     | 36 & later ✔                                                                               | 79 & later ✔                                                                            | Latest ✔                                                                                      | Latest ✔                                                                                   | Latest ✔                                                                                         |

## 🎉 Currently in Beta with over 2500 users!

We are still in Beta, so please remember to backup your keys and don't store large amounts as there may be breaking changes or bugs discovered during future audits and bug bounties. Early beta testers and community may receive exclusive NFT and token drops so [join our Community Chat](https://t.me/earthwallet), or if you are looking apply to [join the Earth Association](https://discord.gg/aemgEpMye3)!

:white_check_mark: Self Custody (your keys, your crypto) <br/>
:white_check_mark: 100% Open Source <br/>
:white_check_mark: Decentralized App Developer SDK <br/>
:white_check_mark: Internet Computer Protocol Support <br/>
:black_square_button: Bitcoin, Ethereum, and other multichain support (Q3) <br/>
:black_square_button: NFTs, Tokens, and other DeFi Protocol support (Q3) <br/>
:black_square_button: Robust Security Audits (Q3/Q4) <br/>
:black_square_button: Core Code Freeze (Q4) <br/>
:black_square_button: Earth Protocol (🙊)

## 🌎 Decentralized App Developer SDK

Looking to build on the Internet Computer? The Earth Wallet SDK lets you delegate to a secure, user friendly key signer, to give your application the best user experience possible. This gives both you and your users the peace of mind that their private keys are not exposed to applications, and lets them decide which dapps to sign into. To use this, simply add the following code to your dapp:

```js
// This will inject the Earth Wallet listener if it is installed.
const injectEarth = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', () => {
      if (window.earth) {
        // Handle Earth Wallet Events here.
        resolve(window.earth);
      } else {
        // Earth Wallet is not installed.
        reject(new Error('Earth Wallet not installed.'));
      }
    });
  });
};

// Connect to Earth Wallet (i.e. show accounts available, etc)
const handleEarthEnable = () => {
  await injectEarth();
    window?.earth
    .enable().then((account) => {
        console.log("Successfully connected to Earth Wallet 🌍", account);
        onConnect();
      })
      .catch((err) => {
        console.error(err);
      });
  };
```

## 🚀 Auditors / Bug Hunters - $10k USD+ Available!!

We have an on going bug bounty campaign for $10,000 USD, as well as full time positions available. If you find a bug, or simply have an idea of how to make the code better/faster/more secure, please [join our Developer Server](https://discord.gg/aemgEpMye3). Help create the most secure open source digital asset wallet and own a piece the future!

To get started, ensure you have:

- [Node.js](https://nodejs.org) 10 or later installed
- [Yarn](https://yarnpkg.com) v1 or v2 installed

Then run the following:

- `yarn install` to install dependencies.
- `yarn run dev:chrome` to start the development server for chrome extension
- `yarn run dev:firefox` to start the development server for firefox addon
- `yarn run dev:opera` to start the development server for opera extension
- `yarn run build:chrome` to build chrome extension
- `yarn run build:firefox` to build firefox addon
- `yarn run build:opera` to build opera extension
- `yarn run build` builds and packs extensions all at once to extension/ directory

### Running Locally

- `yarn install` to install dependencies.
- To watch file changes in development

  - Chrome
    - `yarn run dev:chrome`
  - Firefox
    - `yarn run dev:firefox`
  - Opera
    - `yarn run dev:opera`

- **Load extension in browser**

- ### Chrome

  - Go to the browser address bar and type `chrome://extensions`
  - Check the `Developer Mode` button to enable it.
  - Click on the `Load Unpacked Extension…` button.
  - Select your extension’s extracted directory.

- ### Firefox

  - Load the Add-on via `about:debugging` as temporary Add-on.
  - Choose the `manifest.json` file in the extracted directory

- ### Opera

  - Load the extension via `opera:extensions`
  - Check the `Developer Mode` and load as unpacked from extension’s extracted directory.

### Build and Install the Extension

- `yarn run build` builds the extension for all the browsers to `extension/BROWSER` directory respectively.

Note: By default the `manifest.json` is set with version `0.0.0`. The webpack loader will update the version in the build with that of the `package.json` version. In order to release a new version, update version in `package.json` and run script.

# Contributors

The best way to submit feedback and report bugs is to [open a GitHub issue](https://github.com/earth-association/wallet/issues/new).
If you want to contribute code please join our [Developer Server](https://discord.gg/gmgPCBnvJd).

Thanks to all the people who contribute!

# License

Earth Wallet is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
