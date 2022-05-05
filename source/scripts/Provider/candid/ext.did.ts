// @ts-nocheck
export default ({ IDL }) => {
  const SubAccount_2 = IDL.Vec(IDL.Nat8);
  const SubAccount = SubAccount_2;
  const SubAccount_3 = SubAccount;
  const AccountIdentifier_2 = IDL.Text;
  const AccountIdentifier = AccountIdentifier_2;
  const AccountIdentifier_3 = AccountIdentifier;
  const File = IDL.Record({
    data: IDL.Vec(IDL.Vec(IDL.Nat8)),
    ctype: IDL.Text,
  });
  const Asset = IDL.Record({
    thumbnail: IDL.Opt(File),
    name: IDL.Text,
    payload: File,
  });
  const TokenIndex_2 = IDL.Nat32;
  const TokenIndex = TokenIndex_2;
  const Settlement = IDL.Record({
    subaccount: SubAccount_3,
    seller: IDL.Principal,
    buyer: AccountIdentifier_3,
    price: IDL.Nat64,
  });
  const TokenIdentifier = IDL.Text;
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier,
  });
  const BalanceRequest_2 = IDL.Record({
    token: TokenIdentifier,
    user: User,
  });
  const BalanceRequest = BalanceRequest_2;
  const Balance = IDL.Nat;
  const CommonError_2 = IDL.Variant({
    InvalidToken: TokenIdentifier,
    Other: IDL.Text,
  });
  const Result_9 = IDL.Variant({ ok: Balance, err: CommonError_2 });
  const BalanceResponse_2 = Result_9;
  const BalanceResponse = BalanceResponse_2;
  const TokenIdentifier_2 = TokenIdentifier;
  const CommonError = CommonError_2;
  const Result_7 = IDL.Variant({
    ok: AccountIdentifier_3,
    err: CommonError,
  });
  const Time_2 = IDL.Int;
  const Time = Time_2;
  const Listing = IDL.Record({
    locked: IDL.Opt(Time),
    seller: IDL.Principal,
    price: IDL.Nat64,
  });
  const Result_8 = IDL.Variant({
    ok: IDL.Tuple(AccountIdentifier_3, IDL.Opt(Listing)),
    err: CommonError,
  });
  const Extension_2 = IDL.Text;
  const Extension = Extension_2;
  const Metadata_2 = IDL.Variant({
    fungible: IDL.Record({
      decimals: IDL.Nat8,
      metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
      name: IDL.Text,
      symbol: IDL.Text,
    }),
    nonfungible: IDL.Record({ metadata: IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const Metadata = Metadata_2;
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  });
  const HttpStreamingCallbackToken = IDL.Record({
    key: IDL.Text,
    sha256: IDL.Opt(IDL.Vec(IDL.Nat8)),
    index: IDL.Nat,
    content_encoding: IDL.Text,
  });
  const HttpStreamingCallbackResponse = IDL.Record({
    token: IDL.Opt(HttpStreamingCallbackToken),
    body: IDL.Vec(IDL.Nat8),
  });
  const HttpStreamingStrategy = IDL.Variant({
    Callback: IDL.Record({
      token: HttpStreamingCallbackToken,
      callback: IDL.Func(
        [HttpStreamingCallbackToken],
        [HttpStreamingCallbackResponse],
        ['query']
      ),
    }),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    streaming_strategy: IDL.Opt(HttpStreamingStrategy),
    status_code: IDL.Nat16,
  });
  const ListRequest = IDL.Record({
    token: TokenIdentifier_2,
    from_subaccount: IDL.Opt(SubAccount_3),
    price: IDL.Opt(IDL.Nat64),
  });
  const Result_5 = IDL.Variant({ ok: IDL.Null, err: CommonError });
  const Result_6 = IDL.Variant({ ok: Metadata, err: CommonError });
  const MintRequest_2 = IDL.Record({
    to: User,
    metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const MintRequest = MintRequest_2;
  const Balance_2 = Balance;
  const Result_4 = IDL.Variant({ ok: Balance_2, err: CommonError });
  const Result_3 = IDL.Variant({
    ok: IDL.Vec(TokenIndex),
    err: CommonError,
  });
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(
      IDL.Tuple(TokenIndex, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))
    ),
    err: CommonError,
  });
  const Transaction = IDL.Record({
    token: TokenIdentifier_2,
    time: Time,
    seller: IDL.Principal,
    buyer: AccountIdentifier_3,
    price: IDL.Nat64,
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const TransferRequest_2 = IDL.Record({
    to: User,
    token: TokenIdentifier,
    notify: IDL.Bool,
    from: User,
    memo: Memo,
    subaccount: IDL.Opt(SubAccount),
    amount: Balance,
  });
  const TransferRequest = TransferRequest_2;
  const Result = IDL.Variant({
    ok: Balance,
    err: IDL.Variant({
      CannotNotify: AccountIdentifier,
      InsufficientBalance: IDL.Null,
      InvalidToken: TokenIdentifier,
      Rejected: IDL.Null,
      Unauthorized: AccountIdentifier,
      Other: IDL.Text,
    }),
  });
  const TransferResponse_2 = Result;
  const TransferResponse = TransferResponse_2;
  return IDL.Service({
    TEMPaddPayment: IDL.Func([IDL.Text, IDL.Principal, SubAccount_3], [], []),
    TEMPusedAddresses: IDL.Func(
      [IDL.Text],
      [IDL.Vec(IDL.Tuple(AccountIdentifier_3, IDL.Principal, SubAccount_3))],
      []
    ),
    acceptCycles: IDL.Func([], [], []),
    addAsset: IDL.Func([Asset], [IDL.Nat], []),
    allPayments: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(SubAccount_3)))],
      ['query']
    ),
    allSettlements: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TokenIndex, Settlement))],
      ['query']
    ),
    availableCycles: IDL.Func([], [IDL.Nat], ['query']),
    balance: IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
    bearer: IDL.Func([TokenIdentifier_2], [Result_7], ['query']),
    clearPayments: IDL.Func([IDL.Principal, IDL.Vec(SubAccount_3)], [], []),
    details: IDL.Func([TokenIdentifier_2], [Result_8], ['query']),
    extensions: IDL.Func([], [IDL.Vec(Extension)], ['query']),
    getMinter: IDL.Func([], [IDL.Principal], ['query']),
    getRegistry: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier_3))],
      ['query']
    ),
    getTokens: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TokenIndex, Metadata))],
      ['query']
    ),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    http_request_streaming_callback: IDL.Func(
      [HttpStreamingCallbackToken],
      [HttpStreamingCallbackResponse],
      ['query']
    ),
    list: IDL.Func([ListRequest], [Result_5], []),
    listings: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TokenIndex, Listing, Metadata))],
      ['query']
    ),
    lock: IDL.Func(
      [TokenIdentifier_2, IDL.Nat64, AccountIdentifier_3, SubAccount_3],
      [Result_7],
      []
    ),
    metadata: IDL.Func([TokenIdentifier_2], [Result_6], ['query']),
    mintNFT: IDL.Func([MintRequest], [TokenIndex], []),
    payments: IDL.Func([], [IDL.Opt(IDL.Vec(SubAccount_3))], ['query']),
    refunds: IDL.Func([], [IDL.Opt(IDL.Vec(SubAccount_3))], ['query']),
    removePayments: IDL.Func([IDL.Vec(SubAccount_3)], [], []),
    removeRefunds: IDL.Func([IDL.Vec(SubAccount_3)], [], []),
    setMinter: IDL.Func([IDL.Principal], [], []),
    settle: IDL.Func([TokenIdentifier_2], [Result_5], []),
    settlements: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier_3, IDL.Nat64))],
      ['query']
    ),
    streamAsset: IDL.Func([IDL.Nat, IDL.Bool, IDL.Vec(IDL.Nat8)], [], []),
    supply: IDL.Func([TokenIdentifier_2], [Result_4], ['query']),
    tokens: IDL.Func([AccountIdentifier_3], [Result_3], ['query']),
    tokens_ext: IDL.Func([AccountIdentifier_3], [Result_2], ['query']),
    transactions: IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    transfer: IDL.Func([TransferRequest], [TransferResponse], []),
    updateThumb: IDL.Func([IDL.Text, File], [IDL.Opt(IDL.Nat)], []),
  });
};
export const init = () => {
  return [];
};
