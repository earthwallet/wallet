import { keyable } from '~scripts/Background/types/IAssetsController';

export const ICP_NFT_LIST = [
  {
    name: 'Cronic Critters',
    id: 'e3izy-jiaaa-aaaah-qacbq-cai',
    standard: 'EXT',
    isLive: true,
    description:
      'Cronics is a Play-to-earn NFT game being developed by ToniqLabs for the Internet Computer. Cronics  incorporates breeding mechanics, wearable NFTs and a p2e minigame ecosystem and more.',
    icon: 'https://e3izy-jiaaa-aaaah-qacbq-cai.raw.ic0.app/?tokenid=hancg-5ykor-uwiaa-aaaaa-b4aaq-maqca-aabuk-a',
  },
  {
    name: 'Starverse',
    id: 'nbg4r-saaaa-aaaah-qap7a-cai',
    standard: 'EXT',
    isLive: true,
    description:
      'Starverse is an NFT collection of rare and unique Stars, a collaboration between DSCVR and ToniqLabs. The Starverse symbolizes the unlimited potential of the Internet Computer with it’s infinite size and unstoppable nature.',
    icon: 'https://nbg4r-saaaa-aaaah-qap7a-cai.raw.ic0.app/?tokenid=wdyem-pikor-uwiaa-aaaaa-b4ad7-yaqca-aacsh-a',
  },
  {
    name: 'Wrapped ICPunks',
    wrapped: true,
    id: 'bxdf4-baaaa-aaaah-qaruq-cai',
    standard: 'EXT',
    isLive: true,
    description:
      'ICPunks wrapped under the EXT standard. 10,000 randomly generated, unique collectible clowns with proof of ownership stored on the Internet Computer blockchain. Created as a reference to a meme comparing the Internet Computer token (ICP) with the Insane Clown Posse.',
    icon: 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1',
    tokenImage: (tokenIndex: string) =>
      `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/${tokenIndex}`,
  },
  {
    name: 'ICP News',
    id: 'uzhxd-ziaaa-aaaah-qanaq-cai',
    standard: 'EXT',
    isLive: true,
    description:
      'An NFT collection set designed by the @icp_news artist with an Internet Computer theme.',
    icon: 'https://uzhxd-ziaaa-aaaah-qanaq-cai.raw.ic0.app/?tokenid=3qdzl-jikor-uwiaa-aaaaa-b4adi-eaqca-aaaad-q',
  },
  {
    name: 'Cronic Wearables',
    id: 'tde7l-3qaaa-aaaah-qansa-cai',
    isLive: true,
    standard: 'EXT',
    description:
      'Wearable NFTs, usable with the Cronics NFT collection. A Play-to-earn NFT game being developed by ToniqLabs for the Internet Computer. Cronics  incorporates breeding mechanics, wearable NFTs, a p2e minigame ecosystem, and more.',
    icon: 'https://entrepot.app/collections/tde7l-3qaaa-aaaah-qansa-cai.jpg',
  },
  {
    name: 'ICMojis',
    id: 'gevsk-tqaaa-aaaah-qaoca-cai',
    isLive: true,
    standard: 'EXT',
    description:
      'A collection inspired in old school forum emotes, also part of the interactive strategy game ICMoji Origins.',
    icon: 'https://gevsk-tqaaa-aaaah-qaoca-cai.raw.ic0.app/?tokenid=vqwej-jikor-uwiaa-aaaaa-b4adq-qaqca-aaaac-q',
  },
  {
    name: 'ICPuzzle',
    id: 'owuqd-dyaaa-aaaah-qapxq-cai',
    standard: 'EXT',
    isLive: true,
    description:
      'The ICPuzzle NFT is an artistic NFT that is meant to invoke thought around individuality, community, and the beauty of the human condition. Each puzzle piece represents human individuality within humanity, a self-contained piece of a larger cohesive whole.',
    icon: 'https://owuqd-dyaaa-aaaah-qapxq-cai.raw.ic0.app/?tokenid=2e7o5-wykor-uwiaa-aaaaa-b4ad5-4aqca-aaagc-q',
  },
  {
    name: 'IC Drip',
    id: '3db6u-aiaaa-aaaah-qbjbq-cai',
    standard: 'EXT',
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
    standard: 'EXT',
    isLive: true,
    description:
      'An NFT photographic series created by the photographer @olisav ',
    icon: 'https://73xld-saaaa-aaaah-qbjya-cai.raw.ic0.app/?tokenid=tpx6i-sykor-uwiaa-aaaaa-b4ako-aaqca-aaaaz-a',
  },
  {
    name: 'ICPunks',
    isLive: false,
    id: 'qcg3w-tyaaa-aaaah-qakea-cai',
    standard: 'ICPunks',
    description:
      '10,000 randomly generated, unique collectible clowns with proof of ownership stored on the Internet Computer blockchain. Created as a reference to a meme comparing the Internet Computer token (ICP) with the Insane Clown Posse - an American hip hop duo founded in 1989.',
    icon: 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1',
  },
  {
    name: 'Faceted Meninas',
    id: 'k4qsa-4aaaa-aaaah-qbvnq-cai',
    isLive: true,
    standard: 'EXT',
    description:
      'Faceted Meninas is a creature species that holds the power of the universe to act as a magic pillar giving their allies the essence of outer worlds to maximize their powers.',
    icon: 'https://k4qsa-4aaaa-aaaah-qbvnq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=3h23b-3akor-uwiaa-aaaaa-b4anl-maqca-aaabq-a',
  },
  {
    name: 'ICTuTs',
    id: 'ahl3d-xqaaa-aaaaj-qacca-cai',
    isLive: true,
    standard: 'EXT',
    description:
      'ICTuts - 1st pharaohs NFTs in the world. 10,000 randomly generated TuTs',
    icon: 'https://ahl3d-xqaaa-aaaaj-qacca-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=cplrp-sqkor-uwiaa-aaaaa-cmaaq-qaqca-aaafe-q',
  },
  {
    name: 'ICPuppies',
    id: 'njgly-uaaaa-aaaah-qb6pa-cai',
    isLive: true,
    standard: 'EXT',
    description: '10,000 randomly generated 8-bit puppy NFTs',
    icon: 'https://njgly-uaaaa-aaaah-qb6pa-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=e6dxx-4akor-uwiaa-aaaaa-b4apt-yaqca-aaavm-q',
  },
  {
    name: 'Internet Astronauts',
    id: 'sr4qi-vaaaa-aaaah-qcaaq-cai',
    isLive: true,
    standard: 'EXT',
    description: `Internet Astronauts is a collection of 10,000 unique digital NFT collectibles only found on the Internet Computer! Internet Astronauts can have 
    advantages for various dapps on the Internet Computer Protocol(ICP) since all dapps on-chain. 
    Holders will receive the Space Center membership where they can have fun.`,
    icon: 'https://sr4qi-vaaaa-aaaah-qcaaq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=6roeh-nykor-uwiaa-aaaaa-b4aqa-eaqca-aaaaa-a',
  },
  {
    name: 'ICelebrity',
    id: 'kss7i-hqaaa-aaaah-qbvmq-cai',
    isLive: true,
    standard: 'EXT',
    description: `100 Uniquely Minted handmade artistic representation of the people we know and love.`,
    icon: 'https://kss7i-hqaaa-aaaah-qbvmq-cai.raw.ic0.app/?tokenid=pvu3y-iakor-uwiaa-aaaaa-b4anl-eaqca-aaaag-q',
  },
  {
    name: 'ICPBunny',
    id: 'fu2zl-ayaaa-aaaaf-qaegq-cai',
    isLive: false,
    standard: 'ICPBunny',
    description: `ICPBunny - Yieldable and Breedable NFT`,
    icon: 'https://ecrba-viaaa-aaaaf-qaedq-cai.raw.ic0.app/Token/1',
  },
  {
    name: 'Motoko Day',
    id: 'oeee4-qaaaa-aaaak-qaaeq-cai',
    isLive: true,
    standard: 'EXT',
    description: `On the Motoko programming language's 2nd birthday, the DFINITY Foundation distributed 10,000 Motoko ghosts designed by Jon Ball of Pokedstudios to the community.`,
    icon: 'https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=w44h6-eakor-uwiaa-aaaaa-cuaab-eaqca-aaedg-a',
  },
  {
    name: 'Infernal Vampire Colony',
    id: 'gyuaf-kqaaa-aaaah-qceka-cai',
    isLive: true,
    standard: 'EXT',
    description: `Infernal Vampires had been in the lair for a long time. They finally managed to get out. Time for them to suck some blood!`,
    icon: 'https://gyuaf-kqaaa-aaaah-qceka-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=frfav-fakor-uwiaa-aaaaa-b4arc-qaqca-aaaim-a',
  },
  {
    name: 'Haunted Hamsters',
    id: 'bid2t-gyaaa-aaaah-qcdea-cai',
    isLive: true,
    standard: 'EXT',
    description: `Infernal Vampires had been in the lair for a long time. They finally managed to get out. Time for them to suck some blood!`,
    icon: 'https://bid2t-gyaaa-aaaah-qcdea-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=kzu34-iqkor-uwiaa-aaaaa-b4aqz-aaqca-aadgp-q',
  },
  {
    name: 'Poked bots',
    id: 'bzsui-sqaaa-aaaah-qce2a-cai',
    isLive: true,
    standard: 'EXT',
    description: `500 years from now humans have long left earth and only the Robots remain. Robots have managed to create new identities often based on relics they have found from earths past.`,
    icon: 'https://bzsui-sqaaa-aaaah-qce2a-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=rdlwm-kakor-uwiaa-aaaaa-b4arg-qaqca-aae4h-q',
  },
];

const LIVE_ICP_NFT_LIST_CANISTER_IDS = ICP_NFT_LIST.filter(
  (asset) => asset.isLive
).map((asset) => asset.id);

export const getTokenCollectionInfo = (canisterId: string) =>
  ICP_NFT_LIST.filter((asset) => asset.id === canisterId)[0];

export const getTokenImageURL = (asset: keyable) => {
  const isWrapped = getTokenCollectionInfo(asset?.canisterId)?.wrapped;
  let imageURL = '';
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
      imageURL = `https://${asset?.canisterId}.raw.ic0.app/?tokenid=${asset?.tokenIdentifier}`;
    }
  }
  return imageURL;
};

export default LIVE_ICP_NFT_LIST_CANISTER_IDS;
