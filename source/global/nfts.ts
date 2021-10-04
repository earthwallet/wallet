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
    tokenImage: (tokenNumber: string) =>
      `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/${tokenNumber}`,
  },
  {
    name: 'ICP News',
    id: 'uzhxd-ziaaa-aaaah-qanaq-cai',
    standard: 'EXT',
    isLive: false,
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
    icon: 'https://tde7l-3qaaa-aaaah-qansa-cai.raw.ic0.app/?tokenid=gvmdu-vikor-uwiaa-aaaaa-b4adm-qaqca-aakby-a',
  },
  {
    name: 'ICMojis',
    id: 'gevsk-tqaaa-aaaah-qaoca-cai',
    isLive: true,
    standard: 'EXT',
    description:
      'A collection inspired in old school forum emotes, designed by the artist @Visions_GFX, also part of the interactive strategy game ICMoji Origins.',
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
    tokenImage: (tokenNumber: string) =>
      `https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app/?tokenId=${tokenNumber}`,
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
];

const LIVE_ICP_NFT_LIST_CANISTER_IDS = ICP_NFT_LIST.filter(
  (asset) => asset.isLive
).map((asset) => asset.id);

export default LIVE_ICP_NFT_LIST_CANISTER_IDS;
