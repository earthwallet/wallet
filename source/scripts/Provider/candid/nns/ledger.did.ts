// @ts-nocheck
export default ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  /*   const Duration = IDL.Record({ secs: IDL.Nat64, nanos: IDL.Nat32 });
  const ArchiveOptions = IDL.Record({
    max_message_size_bytes: IDL.Opt(IDL.Nat32),
    node_max_memory_size_bytes: IDL.Opt(IDL.Nat32),
    controller_id: IDL.Principal,
  }); */
  const ICPTs = IDL.Record({ e8s: IDL.Nat64 });
  /*   const LedgerCanisterInitPayload = IDL.Record({
    send_whitelist: IDL.Vec(IDL.Tuple(IDL.Principal)),
    minting_account: AccountIdentifier,
    transaction_window: IDL.Opt(Duration),
    max_message_size_bytes: IDL.Opt(IDL.Nat32),
    archive_options: IDL.Opt(ArchiveOptions),
    initial_values: IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
  }); */
  const AccountBalanceArgs = IDL.Record({ account: AccountIdentifier });
  const CanisterId = IDL.Principal;
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
  const SubAccount = IDL.Vec(IDL.Nat8);
  const BlockHeight = IDL.Nat64;
  const NotifyCanisterArgs = IDL.Record({
    to_subaccount: IDL.Opt(SubAccount),
    from_subaccount: IDL.Opt(SubAccount),
    to_canister: IDL.Principal,
    max_fee: ICPTs,
    block_height: BlockHeight,
  });
  const Memo = IDL.Nat64;
  const TimeStamp = IDL.Record({ timestamp_nanos: IDL.Nat64 });
  const SendArgs = IDL.Record({
    to: AccountIdentifier,
    fee: ICPTs,
    memo: Memo,
    from_subaccount: IDL.Opt(SubAccount),
    created_at_time: IDL.Opt(TimeStamp),
    amount: ICPTs,
  });
  return IDL.Service({
    account_balance_dfx: IDL.Func([AccountBalanceArgs], [ICPTs], ['query']),
    get_nodes: IDL.Func([], [IDL.Vec(CanisterId)], ['query']),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    notify_dfx: IDL.Func([NotifyCanisterArgs], [], []),
    send_dfx: IDL.Func([SendArgs], [BlockHeight], []),
  });
};
export const init = ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const Duration = IDL.Record({ secs: IDL.Nat64, nanos: IDL.Nat32 });
  const ArchiveOptions = IDL.Record({
    max_message_size_bytes: IDL.Opt(IDL.Nat32),
    node_max_memory_size_bytes: IDL.Opt(IDL.Nat32),
    controller_id: IDL.Principal,
  });
  const ICPTs = IDL.Record({ e8s: IDL.Nat64 });
  const LedgerCanisterInitPayload = IDL.Record({
    send_whitelist: IDL.Vec(IDL.Tuple(IDL.Principal)),
    minting_account: AccountIdentifier,
    transaction_window: IDL.Opt(Duration),
    max_message_size_bytes: IDL.Opt(IDL.Nat32),
    archive_options: IDL.Opt(ArchiveOptions),
    initial_values: IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
  });
  return [LedgerCanisterInitPayload];
};
