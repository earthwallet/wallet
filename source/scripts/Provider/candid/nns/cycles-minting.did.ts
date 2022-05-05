// @ts-nocheck
export default ({ IDL }) => {
  const IcpXdrConversionRate = IDL.Record({
    xdr_permyriad_per_icp: IDL.Nat64,
    timestamp_seconds: IDL.Nat64,
  });
  const IcpXdrConversionRateCertifiedResponse = IDL.Record({
    certificate: IDL.Vec(IDL.Nat8),
    data: IcpXdrConversionRate,
    hash_tree: IDL.Vec(IDL.Nat8),
  });
  const SetAuthorizedSubnetworkListArgs = IDL.Record({
    who: IDL.Opt(IDL.Principal),
    subnets: IDL.Vec(IDL.Principal),
  });
  const ICPTs = IDL.Record({ e8s: IDL.Nat64 });
  const TransactionNotification = IDL.Record({
    to: IDL.Principal,
    to_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: IDL.Principal,
    memo: IDL.Nat64,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount: ICPTs,
    block_height: IDL.Nat64,
  });
  const CyclesResponse = IDL.Variant({
    Refunded: IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat64)),
    CanisterCreated: IDL.Principal,
    ToppedUp: IDL.Null,
  });
  const Result = IDL.Variant({ Ok: CyclesResponse, Err: IDL.Text });
  return IDL.Service({
    get_average_icp_xdr_conversion_rate: IDL.Func(
      [],
      [IcpXdrConversionRateCertifiedResponse],
      ['query']
    ),
    get_icp_xdr_conversion_rate: IDL.Func(
      [],
      [IcpXdrConversionRateCertifiedResponse],
      ['query']
    ),
    set_authorized_subnetwork_list: IDL.Func(
      [SetAuthorizedSubnetworkListArgs],
      [],
      []
    ),
    transaction_notification: IDL.Func([TransactionNotification], [Result], []),
  });
};
export const init = () => {
  return [];
};
