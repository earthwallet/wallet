const es = {
  accounts: {
    paraText: 'Tus claves para un nuevo Internet',
    createAccount: 'Crea una cuenta',
    importSeed: 'importar frase semilla',
    or: 'o',
    selectAccount: 'Seleccionar cuenta',
  },
  nftMarketplace: {
    header: '💎 Explorar NFT',
  },
  nftCollection: {
    listings: 'listados',
    collectionSize: 'Tamaño de la colección',
    sales: 'Ventas',
    volume: 'Volumen',
    floor: 'Piso',
  },
  nftBuyDetails: {
    buy: 'Comprar',
    forSale: 'En venta',
  },
  nftPurchaseDetails: {
    congratsTxt: '¡Felicitaciones por tu nuevo NFT! 🎉',
  },
  nftSettle: {
    cta: 'Comprar NFT',
    free: 'Gratis',
    netFee: 'Tarifa de red',
    marketFee: 'Tarifa del mercado',
    headerLoading: 'Comprar..',
    total: 'Total',
    header: 'Confirmar compra',
  },
  createAccount: {
    header: 'Crea una cuenta',
    accountName: 'Nombre de la cuenta',
    mnemonicLabel: 'Semilla mnemotécnica',
    copy: 'COPIAR',
    download: 'DESCARGAR',
    generated: 'Esta es una semilla mnemotécnica de 12 palabras generada.',
    saved: 'He guardado mi semilla mnemotécnica de forma segura.',
    nextStep: 'Próximo paso',
    checkBox:
      'Entiendo que perderé el acceso a la cuenta si pierdo esta frase mnemotécnica.',
    cta: 'Crea una cuenta',
  },
  export: {
    header: 'Exportar cuenta',
    checkTitle:
      'Entiendo que puedo perder el acceso a los activos digitales si divulgo mis claves privadas.',
    secretMnemonicLabel: 'Mnemónico secreto',
    copy: 'COPIAR',
    download: 'DESCARGAR',
    never:
      'Nunca reveles este secreto. Cualquiera con esta frase puede robar cualquier activo en su cuenta.',
    confirm: 'Confirmar',
    done: 'Hecho',
  },
  importSeed: {
    header: 'Importar cuenta',
    addAccount: 'Añadir cuenta',
    migrationComplete:
      'La migración está completa. Continuar con la cuenta de importación',
    skip: 'Saltar',
    next: 'Próximo',
    label: 'Ingrese su frase de semilla mnemotécnica',
    migrateTitle: 'Migre su cuenta ICP',
  },
  wallet: {
    receive: 'Recibir',
    send: 'Enviar',
    noEd: 'La dirección Ed25519 ya no es compatible. Importe semilla de Export',
    export: 'Exportar',
    txns: 'Actas',
  },
  transactions: {
    header: 'Actas',
    noTxns: 'Sin transacciones',
  },
  transactionDetails: {
    header: 'Detalles',
    pleaseCheck: 'Verifique la identificación de la transacción',
    from: 'De',
    to: 'A',
    transaction: 'Transacción',
    amount: 'Cantidad',
    value: 'Valor',
    txnFees: 'Tarifas de transacción',
    total: 'Total',
    activityLog: 'Registro de actividades',
    txnNarrate: 'Transacción creada con un valor de',
  },
  transactionConfirm: {
    networkFee: 'Tarifa de red',
    dexFee: 'Tarifa DEX',
    free: 'Gratis',
    total: 'Total',
  },
  walletAddressBook: {
    addRecp: 'Agregar destinatario',
    myAccounts: 'Mis cuentas',
    recents: 'Recientes',
    noRecent: 'No hay direcciones enviadas recientemente',
    lastSent: 'Último enviado el',
    noPers: 'No hay otras cuentas personales para enviar',
  },
  walletSendTokens: {
    noZeroAmount: 'La cantidad no puede ser 0',
    payDone: '¡Pago hecho! Verifique las transacciones para más detalles.',
    tryAgain: '¡Inténtalo de nuevo! Error:',
    successTxn: 'Transferido con éxito a',
    successNftTxn: 'NFT transferido con éxito a',
    addRecp: 'Agregar destinatario',
    selectedAsset: 'Activo seleccionado',
    balance: 'Balance:',
    txnFee: 'Tarifa de transacción',
    next: 'Próximo',
    send: 'Enviar',
    max: 'máx.',
    amount: 'Cantidad',
    amountPlace: 'importe hasta 8 decimales',
    inSuf: 'Saldo insuficiente.',
    noZero: 'La cantidad no puede ser cero.',
    noEmpty: 'La cantidad no puede estar vacía.',
    total: 'Total',
    noZeroWith: 'La cantidad no puede ser cero. Las tarifas de transacción son',
  },
  walletReceiveTokens: {
    header: 'Recibir',
    tooltip: 'Comparta esta identificación única para recibir',
    pubAddr: 'Direccion publica',
    cta: 'Cuenta de exportación',
    princTooltip:
      'Con las identificaciones principales, puede crear recipientes y autenticarse en aplicaciones de computadora de Internet y amp; servicios.',
    princLabel: 'Su identificación principal',
  },
  addNetwork: {
    header: 'Agregar una red',
    selectNet: 'Seleccione Redes',
    cta: 'Actualizar',
  },
  selectTokens: {
    tokensListed: 'Fichas enumeradas',
    cta: 'Actualizar',
    header: 'Seleccionar fichas',
  },
  nftList: {
    noNFTs: 'No se encontraron NFT',
    free: 'Gratis',
    claimed: 'Reclamado',
    explore: 'Explorar colecciones',
    forSale: 'En venta',
    unlisted: 'No incluido en listado',
  },
  listNFT: {
    cancel: 'Cancelar venta pública',
    updatePrice: 'Actualizar precio para venta pública',
    listNFT: 'Listar NFT para Venta Pública',
    updateBtn: 'Actualizar precio',
    listBtn: 'Lista para Venta Pública',
    info: 'Ingrese un precio de hasta 8 decimales para la venta pública. El listado es gratuito y en la venta de NFT, el 2.0% del monto se deducirá del 1.0% de la tarifa de regalías de creadores y una tarifa de Network Marketplace del 1%.',
    cancelInfo:
      'Cancelar el listado es gratis y eliminará su NFT de la venta pública.',
    placeholder: 'precio hasta 8 decimales',
  },
  nftDetails: {
    transfer: 'Transferir',
    cancel: 'Cancelar',
    listed: 'Listado para la venta',
    unlisted: 'No incluido en listado',
  },
  nftAirdropDetails: {
    listed: 'Listado para la venta',
    airdrop: 'Entrega por paracaídas',
    free: 'Gratis',
    claimed: 'Reclamado',
  },
  createNFT: {
    txns: 'Actas',
  },
  walletSettings: {
    header: 'Configuraciones de la cuenta',
    web3: 'Proveedor Web3 predeterminado',
    checkbox:
      'Use Earth Wallet como su proveedor predeterminado de billetera Web3',
    connectDapps: 'Aplicaciones conectadas',
    language: 'Idioma',
    trustedDapps: 'Dapps de confianza',
  },
  dappDetails: {
    dappOrigin: 'Origen Dapp',
    connectAddr: 'Dirección conectada',
    dappReqs: 'Solicitudes Dapp -',
    reqId: 'Identificación de solicitud',
    completedOn: 'Completado en',
    reqType: 'tipo de solicitud',
    batchReq: 'Solicitud de lote',
    response: 'Respuesta',
  },
  stake: {
    cta: 'Agregar participación al grupo de liquidez',
    add: 'Agregar',
    stake: 'Apuestas',
    fees: 'Tarifas de LP',
    price: 'Precio',
    complete: '¡Apuesta completa! Actualización de saldos',
    done: '¡Hecho!',
    selectSecond: '¡Seleccione la segunda ficha!',
  },
  stakeEth: {
    header: 'Apuesta ETH',
    stake: 'Apostar',
    unstake: 'Dejar de apostar',
    claimRewards: 'Reclamar premios',
    yourStake: 'tu apuesta',
    stakingRewards: 'Recompensas de participación',
    total: 'Total apostado',
    validatorFee: 'Tarifa del validador',
    max: 'máx.',
    info: 'La red Ethereum recompensa a los participantes por ayudar a proteger la cadena de bloques. Al apostar ETH, puede ganar hasta un 5% APY sin riesgo de su billetera de auto custodia.',
  },
  stakeEthConfirm: {
    stake: 'Apostar',
    unstake: 'Dejar de apostar',
    cancel: 'Cancelar',
    txnComplete: '¡Transacción completa!',
    estGas: 'Tarifa estimada de gas',
    total: 'Total',
    stakeSucc: '¡Solicitud de participación enviada con éxito!',
    unstakeSucc: '¡Solicitud de desinterés enviada con éxito!',
  },
  swap: {
    info: 'Earth DEX te permite intercambiar tus tokens sin intermediarios centrales. Las tarifas se utilizan para compensar las emisiones.',
    mintFees: 'Tarifas de menta',
    swapFees: 'Tarifas de intercambio',
    price: 'Precio',
    totalSupply: 'Suministro total',
    inSuf: 'Saldo insuficiente',
    next: 'Próximo',
    swap: 'Intercambio',
    stakeCompl: '¡Apuesta completa! Actualización de saldos',
    selectSec: '¡Seleccione la segunda ficha!',
    done: '¡Hecho!',
  },
  tokenDetailsWithInfo: {
    mint: 'menta',
    recv: 'Recibir',
    send: 'Enviar',
    stake: 'Apostar',
    marketCap: 'Tapa del mercado',
    vol: 'Volumen 24h',
    maxSupply: 'Suministro máximo',
    yourStake: 'tu apuesta',
    stakeRewards: 'Recompensas de participación',
  },
  tokenDetails: {
    select: 'Seleccionar fichas',
    totalBalance: 'Balance total',
    tokens: 'fichas',
    nfts: 'NFT',
    apps: 'aplicaciones',
    rec: 'Recibir',
    send: 'Enviar',
    export: 'Exportar',
  },
  common: {
    passwordForAc: 'contraseña para esta cuenta',
    requiredPlaceholder: 'REQUERIDO',
    wrongPass: '¡Contraseña incorrecta! Inténtalo de nuevo',
  },
};
export default es;