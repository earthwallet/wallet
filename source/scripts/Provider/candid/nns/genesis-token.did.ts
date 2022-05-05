// @ts-nocheck
export default ({ IDL }) => {
  const NeuronId = IDL.Record({ id: IDL.Nat64 });
  const Result = IDL.Variant({ Ok: IDL.Vec(NeuronId), Err: IDL.Text });
  const Result_1 = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
  const TransferredNeuron = IDL.Record({
    error: IDL.Opt(IDL.Text),
    timestamp_seconds: IDL.Nat64,
    neuron_id: IDL.Opt(NeuronId),
  });
  const AccountState = IDL.Record({
    authenticated_principal_id: IDL.Opt(IDL.Principal),
    successfully_transferred_neurons: IDL.Vec(TransferredNeuron),
    has_donated: IDL.Bool,
    failed_transferred_neurons: IDL.Vec(TransferredNeuron),
    neuron_ids: IDL.Vec(NeuronId),
    has_claimed: IDL.Bool,
    has_forwarded: IDL.Bool,
    icpts: IDL.Nat32,
  });
  const Result_2 = IDL.Variant({ Ok: AccountState, Err: IDL.Text });
  return IDL.Service({
    balance: IDL.Func([IDL.Text], [IDL.Nat32], ['query']),
    claim_neurons: IDL.Func([IDL.Text], [Result], []),
    donate_account: IDL.Func([IDL.Text], [Result_1], []),
    forward_all_unclaimed_accounts: IDL.Func([IDL.Null], [Result_1], []),
    get_account: IDL.Func([IDL.Text], [Result_2], ['query']),
    len: IDL.Func([], [IDL.Nat16], ['query']),
    total: IDL.Func([], [IDL.Nat32], ['query']),
  });
};
export const init = () => {
  return [];
};
