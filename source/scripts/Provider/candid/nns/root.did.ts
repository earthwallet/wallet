// @ts-nocheck
export default ({ IDL }) => {
  const CanisterIdRecord = IDL.Record({ canister_id: IDL.Principal });
  const CanisterStatusResult = IDL.Record({
    controller: IDL.Principal,
    status: IDL.Variant({
      stopped: IDL.Null,
      stopping: IDL.Null,
      running: IDL.Null,
    }),
    memory_size: IDL.Nat,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const MethodAuthzChange = IDL.Record({
    principal: IDL.Opt(IDL.Principal),
    method_name: IDL.Text,
    canister: IDL.Principal,
    operation: IDL.Variant({
      Authorize: IDL.Record({ add_self: IDL.Bool }),
      Deauthorize: IDL.Null,
    }),
  });
  const ChangeNnsCanisterProposalPayload = IDL.Record({
    arg: IDL.Vec(IDL.Nat8),
    wasm_module: IDL.Vec(IDL.Nat8),
    stop_before_installing: IDL.Bool,
    mode: IDL.Variant({
      reinstall: IDL.Null,
      upgrade: IDL.Null,
      install: IDL.Null,
    }),
    canister_id: IDL.Principal,
    query_allocation: IDL.Opt(IDL.Nat),
    authz_changes: IDL.Vec(MethodAuthzChange),
    memory_allocation: IDL.Opt(IDL.Nat),
    compute_allocation: IDL.Opt(IDL.Nat),
  });
  const ProposalId = IDL.Nat64;
  const Result_ProposalId_String = IDL.Variant({
    Ok: ProposalId,
    Err: IDL.Text,
  });
  return IDL.Service({
    canister_status: IDL.Func([CanisterIdRecord], [CanisterStatusResult], []),
    change_nns_canister: IDL.Func([ChangeNnsCanisterProposalPayload], [], []),
    submit_change_nns_canister_proposal: IDL.Func(
      [IDL.Nat64, ChangeNnsCanisterProposalPayload],
      [Result_ProposalId_String],
      []
    ),
  });
};
export const init = () => {
  return [];
};
