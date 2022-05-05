// @ts-nocheck
export default ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const AttachCanisterRequest = IDL.Record({
    name: IDL.Text,
    canister_id: IDL.Principal,
  });
  const AttachCanisterResponse = IDL.Variant({
    Ok: IDL.Null,
    CanisterAlreadyAttached: IDL.Null,
    NameAlreadyTaken: IDL.Null,
    NameTooLong: IDL.Null,
    CanisterLimitExceeded: IDL.Null,
  });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const SubAccountDetails = IDL.Record({
    name: IDL.Text,
    sub_account: SubAccount,
    account_identifier: AccountIdentifier,
  });
  const CreateSubAccountResponse = IDL.Variant({
    Ok: SubAccountDetails,
    AccountNotFound: IDL.Null,
    NameTooLong: IDL.Null,
    SubAccountLimitExceeded: IDL.Null,
  });
  const DetachCanisterRequest = IDL.Record({ canister_id: IDL.Principal });
  const DetachCanisterResponse = IDL.Variant({
    Ok: IDL.Null,
    CanisterNotFound: IDL.Null,
  });
  const HardwareWalletAccountDetails = IDL.Record({
    name: IDL.Text,
    account_identifier: AccountIdentifier,
  });
  const AccountDetails = IDL.Record({
    account_identifier: AccountIdentifier,
    hardware_wallet_accounts: IDL.Vec(HardwareWalletAccountDetails),
    sub_accounts: IDL.Vec(SubAccountDetails),
  });
  const GetAccountResponse = IDL.Variant({
    Ok: AccountDetails,
    AccountNotFound: IDL.Null,
  });
  const CanisterDetails = IDL.Record({
    name: IDL.Text,
    canister_id: IDL.Principal,
  });
  const BlockHeight = IDL.Nat64;
  const Stats = IDL.Record({
    latest_transaction_block_height: BlockHeight,
    seconds_since_last_ledger_sync: IDL.Nat64,
    sub_accounts_count: IDL.Nat64,
    hardware_wallet_accounts_count: IDL.Nat64,
    accounts_count: IDL.Nat64,
    earliest_transaction_block_height: BlockHeight,
    transactions_count: IDL.Nat64,
    block_height_synced_up_to: IDL.Opt(IDL.Nat64),
    latest_transaction_timestamp_nanos: IDL.Nat64,
    earliest_transaction_timestamp_nanos: IDL.Nat64,
  });
  const GetTransactionsRequest = IDL.Record({
    page_size: IDL.Nat8,
    offset: IDL.Nat32,
    account_identifier: AccountIdentifier,
  });
  const Timestamp = IDL.Record({ timestamp_nanos: IDL.Nat64 });
  const ICPTs = IDL.Record({ e8s: IDL.Nat64 });
  const Send = IDL.Record({
    to: AccountIdentifier,
    fee: ICPTs,
    amount: ICPTs,
  });
  const Receive = IDL.Record({
    fee: ICPTs,
    from: AccountIdentifier,
    amount: ICPTs,
  });
  const Transfer = IDL.Variant({
    Burn: IDL.Record({ amount: ICPTs }),
    Mint: IDL.Record({ amount: ICPTs }),
    Send: Send,
    Receive: Receive,
  });
  const Transaction = IDL.Record({
    memo: IDL.Nat64,
    timestamp: Timestamp,
    block_height: BlockHeight,
    transfer: Transfer,
  });
  const GetTransactionsResponse = IDL.Record({
    total: IDL.Nat32,
    transactions: IDL.Vec(Transaction),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    status_code: IDL.Nat16,
  });
  const RegisterHardwareWalletRequest = IDL.Record({
    name: IDL.Text,
    account_identifier: AccountIdentifier,
  });
  const RegisterHardwareWalletResponse = IDL.Variant({
    Ok: IDL.Null,
    AccountNotFound: IDL.Null,
    HardwareWalletAlreadyRegistered: IDL.Null,
    HardwareWalletLimitExceeded: IDL.Null,
    NameTooLong: IDL.Null,
  });
  const RemoveHardwareWalletRequest = IDL.Record({
    account_identifier: AccountIdentifier,
  });
  const RemoveHardwareWalletResponse = IDL.Variant({
    Ok: IDL.Null,
    HardwareWalletNotFound: IDL.Null,
  });
  const RenameSubAccountRequest = IDL.Record({
    new_name: IDL.Text,
    account_identifier: AccountIdentifier,
  });
  const RenameSubAccountResponse = IDL.Variant({
    Ok: IDL.Null,
    AccountNotFound: IDL.Null,
    SubAccountNotFound: IDL.Null,
    NameTooLong: IDL.Null,
  });
  return IDL.Service({
    add_account: IDL.Func([], [AccountIdentifier], []),
    attach_canister: IDL.Func(
      [AttachCanisterRequest],
      [AttachCanisterResponse],
      []
    ),
    create_sub_account: IDL.Func([IDL.Text], [CreateSubAccountResponse], []),
    detach_canister: IDL.Func(
      [DetachCanisterRequest],
      [DetachCanisterResponse],
      []
    ),
    get_account: IDL.Func([], [GetAccountResponse], ['query']),
    get_canisters: IDL.Func([], [IDL.Vec(CanisterDetails)], ['query']),
    get_icp_to_cycles_conversion_rate: IDL.Func([], [IDL.Nat64], ['query']),
    get_stats: IDL.Func([], [Stats], ['query']),
    get_transactions: IDL.Func(
      [GetTransactionsRequest],
      [GetTransactionsResponse],
      ['query']
    ),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    register_hardware_wallet: IDL.Func(
      [RegisterHardwareWalletRequest],
      [RegisterHardwareWalletResponse],
      []
    ),
    remove_hardware_wallet: IDL.Func(
      [RemoveHardwareWalletRequest],
      [RemoveHardwareWalletResponse],
      []
    ),
    rename_sub_account: IDL.Func(
      [RenameSubAccountRequest],
      [RenameSubAccountResponse],
      []
    ),
  });
};
export const init = () => {
  return [];
};
