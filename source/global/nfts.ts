import { keyable } from '~scripts/Background/types/IAssetsController';
import NFT_PLACEHOLDER from '~assets/images/nft_placeholder.png';
import ICON_EARTH from '~assets/images/icon-512.png';
import { decodeTokenId } from '@earthwallet/assets';
import NFT_EARTH_DAY from '~assets/images/earthday_nft.png';
import ICON_PLACEHOLDER from '~assets/images/icon_placeholder.png';

export const ICP_NFT_LIST = [
  {
    name: 'Cronic Critters',
    id: 'e3izy-jiaaa-aaaah-qacbq-cai',
    type: 'EXT',
    isLive: true,
    order: 5,
    description:
      'Cronics is a Play-to-earn NFT game being developed by ToniqLabs for the Internet Computer. Cronics  incorporates breeding mechanics, wearable NFTs and a p2e minigame ecosystem and more.',
    icon: 'https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid=hancg-5ykor-uwiaa-aaaaa-b4aaq-maqca-aabuk-a',
  },
  {
    name: 'Starverse',
    id: 'nbg4r-saaaa-aaaah-qap7a-cai',
    type: 'EXT',
    isLive: true,
    order: 15,
    description:
      'Starverse is an NFT collection of rare and unique Stars, a collaboration between DSCVR and ToniqLabs. The Starverse symbolizes the unlimited potential of the Internet Computer with it’s infinite size and unstoppable nature.',
    icon: 'https://nbg4r-saaaa-aaaah-qap7a-cai.raw.ic0.app/?tokenid=wdyem-pikor-uwiaa-aaaaa-b4ad7-yaqca-aacsh-a',
  },
  {
    name: 'Wrapped ICPunks',
    wrapped: true,
    id: 'bxdf4-baaaa-aaaah-qaruq-cai',
    type: 'EXT',
    order: 4,
    isLive: true,
    description:
      'ICPunks wrapped under the EXT type. 10,000 randomly generated, unique collectible clowns with proof of ownership stored on the Internet Computer blockchain. Created as a reference to a meme comparing the Internet Computer token (ICP) with the Insane Clown Posse.',
    icon: 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1',
    tokenImage: (tokenIndex: string) =>
      `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/${tokenIndex}`,
  },
  {
    name: 'ICP News',
    id: 'uzhxd-ziaaa-aaaah-qanaq-cai',
    type: 'EXT',
    isLive: true,
    order: 16,
    description:
      'An NFT collection set designed by the @icp_news artist with an Internet Computer theme.',
    icon: 'https://uzhxd-ziaaa-aaaah-qanaq-cai.raw.ic0.app/?tokenid=3qdzl-jikor-uwiaa-aaaaa-b4adi-eaqca-aaaad-q',
  },
  {
    name: 'Cronic Wearables',
    id: 'tde7l-3qaaa-aaaah-qansa-cai',
    isLive: true,
    type: 'EXT',
    order: 22,
    description:
      'Wearable NFTs, usable with the Cronics NFT collection. A Play-to-earn NFT game being developed by ToniqLabs for the Internet Computer. Cronics  incorporates breeding mechanics, wearable NFTs, a p2e minigame ecosystem, and more.',
    icon: 'https://entrepot.app/collections/tde7l-3qaaa-aaaah-qansa-cai.jpg',
  },
  {
    name: 'ICMojis',
    id: 'gevsk-tqaaa-aaaah-qaoca-cai',
    isLive: true,
    type: 'EXT',
    order: 6,
    description:
      'A collection inspired in old school forum emotes, also part of the interactive strategy game ICMoji Origins.',
    icon: 'https://gevsk-tqaaa-aaaah-qaoca-cai.raw.ic0.app/?tokenid=vqwej-jikor-uwiaa-aaaaa-b4adq-qaqca-aaaac-q',
  },
  {
    name: 'ICPuzzle',
    id: 'owuqd-dyaaa-aaaah-qapxq-cai',
    type: 'EXT',
    order: 6,
    isLive: true,
    description:
      'The ICPuzzle NFT is an artistic NFT that is meant to invoke thought around individuality, community, and the beauty of the human condition. Each puzzle piece represents human individuality within humanity, a self-contained piece of a larger cohesive whole.',
    icon: 'https://owuqd-dyaaa-aaaah-qapxq-cai.raw.ic0.app/?tokenid=2e7o5-wykor-uwiaa-aaaaa-b4ad5-4aqca-aaagc-q',
  },
  {
    name: 'IC Drip',
    id: '3db6u-aiaaa-aaaah-qbjbq-cai',
    type: 'EXT',
    order: 6,
    wrapped: true,
    isLive: true,
    description:
      'IC Drip are randomly generated NFTs with meta-commerce shopping carts for outfits and personas stored on chain on the Internet Computer.',
    icon: 'https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app/?tokenId=1',
    tokenImage: (tokenIndex: string) =>
      `https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app/?tokenId=${tokenIndex}`,
  },
  {
    name: 'Wing',
    id: '73xld-saaaa-aaaah-qbjya-cai',
    type: 'EXT',
    isLive: true,
    order: 12,
    description:
      'An NFT photographic series created by the photographer @olisav ',
    icon: 'https://73xld-saaaa-aaaah-qbjya-cai.raw.ic0.app/?tokenid=tpx6i-sykor-uwiaa-aaaaa-b4ako-aaqca-aaaaz-a',
  },
  {
    name: 'ICPunks',
    isLive: false,
    id: 'qcg3w-tyaaa-aaaah-qakea-cai',
    type: 'ICPunks',
    description:
      '10,000 randomly generated, unique collectible clowns with proof of ownership stored on the Internet Computer blockchain. Created as a reference to a meme comparing the Internet Computer token (ICP) with the Insane Clown Posse - an American hip hop duo founded in 1989.',
    icon: 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1',
  },
  {
    name: 'Faceted Meninas',
    id: 'k4qsa-4aaaa-aaaah-qbvnq-cai',
    isLive: true,
    type: 'EXT',
    order: 11,
    description:
      'Faceted Meninas is a creature species that holds the power of the universe to act as a magic pillar giving their allies the essence of outer worlds to maximize their powers.',
    icon: 'https://k4qsa-4aaaa-aaaah-qbvnq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=3h23b-3akor-uwiaa-aaaaa-b4anl-maqca-aaabq-a',
  },
  {
    name: 'ICTuTs',
    id: 'ahl3d-xqaaa-aaaaj-qacca-cai',
    isLive: true,
    type: 'EXT',
    order: 6,
    description:
      'ICTuts - 1st pharaohs NFTs in the world. 10,000 randomly generated TuTs',
    icon: 'https://ahl3d-xqaaa-aaaaj-qacca-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=cplrp-sqkor-uwiaa-aaaaa-cmaaq-qaqca-aaafe-q',
  },
  {
    name: 'ICPuppies',
    id: 'njgly-uaaaa-aaaah-qb6pa-cai',
    isLive: false,
    type: 'EXT',
    order: 6,
    description: '10,000 randomly generated 8-bit puppy NFTs',
    icon: 'https://njgly-uaaaa-aaaah-qb6pa-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=e6dxx-4akor-uwiaa-aaaaa-b4apt-yaqca-aaavm-q',
  },
  {
    name: 'Internet Astronauts',
    id: 'sr4qi-vaaaa-aaaah-qcaaq-cai',
    isLive: true,
    type: 'EXT',
    order: 6,
    description: `Internet Astronauts is a collection of 10,000 unique digital NFT collectibles only found on the Internet Computer! Internet Astronauts can have
    advantages for various dapps on the Internet Computer Protocol(ICP) since all dapps on-chain.
    Holders will receive the Space Center membership where they can have fun.`,
    icon: 'https://sr4qi-vaaaa-aaaah-qcaaq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=6roeh-nykor-uwiaa-aaaaa-b4aqa-eaqca-aaaaa-a',
  },
  {
    name: 'ICelebrity',
    id: 'kss7i-hqaaa-aaaah-qbvmq-cai',
    isLive: true,
    type: 'EXT',
    order: 17,
    description: `100 Uniquely Minted handmade artistic representation of the people we know and love.`,
    icon: 'https://kss7i-hqaaa-aaaah-qbvmq-cai.raw.ic0.app/?tokenid=pvu3y-iakor-uwiaa-aaaaa-b4anl-eaqca-aaaag-q',
  },
  {
    name: 'ICPBunny',
    id: 'fu2zl-ayaaa-aaaaf-qaegq-cai',
    isLive: false,
    type: 'ICPBunny',
    order: 9,
    description: `ICPBunny - Yieldable and Breedable NFT`,
    icon: 'https://ecrba-viaaa-aaaaf-qaedq-cai.raw.ic0.app/Token/1',
  },
  {
    name: 'Motoko Day',
    id: 'oeee4-qaaaa-aaaak-qaaeq-cai',
    isLive: true,
    order: 2,
    type: 'EXT',
    description: `On the Motoko programming language's 2nd birthday, the DFINITY Foundation distributed 10,000 Motoko ghosts designed by Jon Ball of Pokedstudios to the community.`,
    icon: 'https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=w44h6-eakor-uwiaa-aaaaa-cuaab-eaqca-aaedg-a',
  },
  {
    name: 'Infernal Vampire Colony',
    id: 'gyuaf-kqaaa-aaaah-qceka-cai',
    isLive: true,
    type: 'EXT',
    order: 8,
    description: `Infernal Vampires had been in the lair for a long time. They finally managed to get out. Time for them to suck some blood!`,
    icon: 'https://gyuaf-kqaaa-aaaah-qceka-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=frfav-fakor-uwiaa-aaaaa-b4arc-qaqca-aaaim-a',
  },
  {
    name: 'Haunted Hamsters',
    id: 'bid2t-gyaaa-aaaah-qcdea-cai',
    isLive: true,
    type: 'EXT',
    order: 7,
    description: `Infernal Vampires had been in the lair for a long time. They finally managed to get out. Time for them to suck some blood!`,
    icon: 'https://bid2t-gyaaa-aaaah-qcdea-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=kzu34-iqkor-uwiaa-aaaaa-b4aqz-aaqca-aadgp-q',
  },
  {
    name: 'Poked bots',
    id: 'bzsui-sqaaa-aaaah-qce2a-cai',
    isLive: true,
    type: 'EXT',
    order: 2,
    description: `500 years from now humans have long left earth and only the Robots remain. Robots have managed to create new identities often based on relics they have found from earths past.`,
    icon: 'https://bzsui-sqaaa-aaaah-qce2a-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=rdlwm-kakor-uwiaa-aaaaa-b4arg-qaqca-aae4h-q',
  },
  {
    name: 'Saga Legends #1: The Fool',
    id: 'nges7-giaaa-aaaaj-qaiya-cai',
    type: 'EXT',
    isLive: true,
    order: 6,
    description: '',
    icon: 'https://nges7-giaaa-aaaaj-qaiya-cai.raw.ic0.app/assets/icon.png',
  },
  {
    name: 'ICP Squad',
    id: 'jmuqr-yqaaa-aaaaj-qaicq-cai',
    type: 'EXT',
    isLive: true,
    order: 6,
    description: '',
    icon: 'https://jmuqr-yqaaa-aaaaj-qaicq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=ewpzr-jqkor-uwiaa-aaaaa-cmaca-uaqca-aabwo-a',
  },
  {
    name: 'Earth orchestrator',
    id: 'vsjkh-vyaaa-aaaak-qajgq-cai',
    marketplaceId: 'vvimt-yaaaa-aaaak-qajga-cai',
    type: 'EarthArt',
    isLive: true,
    isAirdrop: false,
    description:
      'Earth Art - Earth NFTs. Create, earn, and collect digital assets and NFTs that let you monetize the value you contribute. ',
    icon: ICON_EARTH,
    order: 1,
  },
];

const LIVE_ICP_NFT_LIST_CANISTER_IDS = ICP_NFT_LIST.filter(
  (asset) => asset.isLive
).map((asset) => asset.id);

export const LIVE_ICP_NFT_LIST = ICP_NFT_LIST.filter(
  (asset) => asset.isLive
).sort((a: keyable, b: keyable) => a?.order - b?.order);

export const getTokenCollectionInfo = (canisterId: string) =>
  ICP_NFT_LIST.filter((asset) => asset.id === canisterId)[0];

export const getTokenImageURL = (asset: keyable) => {
  let imageURL = '';

  if (asset?.symbol == 'ETH' || asset?.symbol == 'MATIC') {
    return asset.tokenImage || ICON_PLACEHOLDER;
  }
  if (asset?.type == 'EarthArt') {
    imageURL = `https://${asset?.canisterId}.raw.ic0.app/id/${asset?.tokenIndex}`;
    return imageURL;
  }
  if (asset?.canisterId === 'vsjkh-vyaaa-aaaak-qajgq-cai') {
    return NFT_PLACEHOLDER;
  }
  const isWrapped = getTokenCollectionInfo(asset?.canisterId)?.wrapped;
  if (isWrapped) {
    if (getTokenCollectionInfo(asset?.canisterId)?.tokenImage !== undefined) {
      let _tokenImage = getTokenCollectionInfo(asset?.canisterId).tokenImage;
      imageURL =
        (_tokenImage !== undefined && _tokenImage(asset?.tokenIndex)) || '';
    }
  } else {
    if (asset?.canisterId === 'ahl3d-xqaaa-aaaaj-qacca-cai') {
      imageURL = `https://${asset?.canisterId}.raw.ic0.app/?cc=0&type=thumbnail&tokenid=${asset?.tokenIdentifier}`;
    } else {
      imageURL = `https://${asset?.canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${asset?.tokenIdentifier}`;
    }
  }
  return imageURL;
};

export const getEarthArtCollectionIcon = (collectionId: string) =>
  `https://${collectionId}.raw.ic0.app/collection`;

export const getTokenImageUrlFromnftId = (nftId: string) => {
  const canisterId = decodeTokenId(nftId).canister;

  const asset: keyable = { canisterId, id: nftId, tokenIdentifier: nftId };
  return getTokenImageURL(asset);
};

export default LIVE_ICP_NFT_LIST_CANISTER_IDS;

export const getAirDropNFTInfo = () => ({
  id: 'earth-day', //slug
  type: 'EarthArt',
  standard: 'EarthArt',
  isLive: true,
  isAirdrop: true,
  name: 'Earth Day 2022', //can be changed
  //can be changed
  description:
    'Happy Earth Day! Something new is coming to Earth and this NFT gets you early access...',
  icon: NFT_EARTH_DAY, //can be changed
  claimedTxt:
    'Congratulations! Your Earth Day NFT is registered and will be sent to account ',
  //can be changed
  twitterButtonCTA: 'Tweet to claim NFT',
  disclaimer:
    'disclaimer: Only one NFT can be claimed per extension. Please wait 5 minutes for tweet verification.',
});

export const MARKETPLACE_ENABLED = true;
