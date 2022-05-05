// @ts-nocheck
export default ({ IDL }) => {
  const NeuronId = IDL.Nat64;
  return IDL.Service({
    canister_status: IDL.Func(
      [IDL.Record({ canister_id: IDL.Principal })],
      [
        IDL.Record({
          controller: IDL.Principal,
          status: IDL.Variant({
            stopped: IDL.Null,
            stopping: IDL.Null,
            running: IDL.Null,
          }),
          memory_size: IDL.Nat,
          module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
        }),
      ],
      []
    ),
    submit_upgrade_root_proposal: IDL.Func(
      [
        NeuronId,
        IDL.Record({
          wasm_module: IDL.Vec(IDL.Nat8),
          module_arg: IDL.Vec(IDL.Nat8),
          stop_upgrade_start: IDL.Bool,
        }),
      ],
      [IDL.Nat64],
      []
    ),
  });
};
export const init = () => {
  return [];
};
