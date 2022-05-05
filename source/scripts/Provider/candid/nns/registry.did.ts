// @ts-nocheck
export default ({ IDL }) => {
  const AddNodePayload = IDL.Record({
    prometheus_metrics_endpoint: IDL.Text,
    http_endpoint: IDL.Text,
    xnet_endpoint: IDL.Text,
    committee_signing_pk: IDL.Vec(IDL.Nat8),
    node_signing_pk: IDL.Vec(IDL.Nat8),
    transport_tls_cert: IDL.Vec(IDL.Nat8),
    ni_dkg_dealing_encryption_pk: IDL.Vec(IDL.Nat8),
    p2p_flow_endpoints: IDL.Vec(IDL.Text),
  });
  const AddNodeOperatorPayload = IDL.Record({
    node_operator_principal_id: IDL.Opt(IDL.Principal),
    node_allowance: IDL.Nat64,
    node_provider_principal_id: IDL.Opt(IDL.Principal),
  });
  const AddNodesToSubnetPayload = IDL.Record({
    subnet_id: IDL.Principal,
    node_ids: IDL.Vec(IDL.Principal),
  });
  const BlessReplicaVersionPayload = IDL.Record({
    node_manager_sha256_hex: IDL.Text,
    release_package_url: IDL.Text,
    sha256_hex: IDL.Text,
    replica_version_id: IDL.Text,
    release_package_sha256_hex: IDL.Text,
    node_manager_binary_url: IDL.Text,
    binary_url: IDL.Text,
  });
  const SubnetType = IDL.Variant({
    application: IDL.Null,
    verified_application: IDL.Null,
    system: IDL.Null,
  });
  const CreateSubnetPayload = IDL.Record({
    unit_delay_millis: IDL.Nat64,
    gossip_registry_poll_period_ms: IDL.Nat32,
    max_ingress_bytes_per_message: IDL.Nat64,
    dkg_dealings_per_block: IDL.Nat64,
    start_as_nns: IDL.Bool,
    is_halted: IDL.Bool,
    gossip_pfn_evaluation_period_ms: IDL.Nat32,
    max_ingress_messages_per_block: IDL.Nat64,
    gossip_max_artifact_streams_per_peer: IDL.Nat32,
    replica_version_id: IDL.Text,
    gossip_max_duplicity: IDL.Nat32,
    gossip_max_chunk_wait_ms: IDL.Nat32,
    dkg_interval_length: IDL.Nat64,
    subnet_id_override: IDL.Opt(IDL.Principal),
    ingress_bytes_per_block_soft_cap: IDL.Nat64,
    initial_notary_delay_millis: IDL.Nat64,
    gossip_max_chunk_size: IDL.Nat32,
    subnet_type: SubnetType,
    gossip_retransmission_request_ms: IDL.Nat32,
    gossip_receive_check_cache_size: IDL.Nat32,
    node_ids: IDL.Vec(IDL.Principal),
  });
  const MethodAuthzInfo = IDL.Record({
    method_name: IDL.Text,
    principal_ids: IDL.Vec(IDL.Vec(IDL.Nat8)),
  });
  const CanisterAuthzInfo = IDL.Record({
    methods_authz: IDL.Vec(MethodAuthzInfo),
  });
  const RecoverSubnetPayload = IDL.Record({
    height: IDL.Nat64,
    replacement_nodes: IDL.Opt(IDL.Vec(IDL.Principal)),
    subnet_id: IDL.Principal,
    registry_store_uri: IDL.Opt(IDL.Tuple(IDL.Text, IDL.Text, IDL.Nat64)),
    state_hash: IDL.Vec(IDL.Nat8),
    time_ns: IDL.Nat64,
  });
  const RemoveNodePayload = IDL.Record({ node_id: IDL.Principal });
  const RemoveNodesFromSubnetPayload = IDL.Record({
    node_ids: IDL.Vec(IDL.Principal),
  });
  const SetFirewallConfigPayload = IDL.Record({
    ipv4_prefixes: IDL.Vec(IDL.Text),
    firewall_config: IDL.Text,
    ipv6_prefixes: IDL.Vec(IDL.Text),
  });
  const AuthzChangeOp = IDL.Variant({
    Authorize: IDL.Record({ add_self: IDL.Bool }),
    Deauthorize: IDL.Null,
  });
  const MethodAuthzChange = IDL.Record({
    principal: IDL.Opt(IDL.Principal),
    method_name: IDL.Text,
    canister: IDL.Principal,
    operation: AuthzChangeOp,
  });
  const UpdateIcpXdrConversionRatePayload = IDL.Record({
    data_source: IDL.Text,
    xdr_permyriad_per_icp: IDL.Nat64,
    timestamp_seconds: IDL.Nat64,
  });
  const UpdateNodeOperatorConfigPayload = IDL.Record({
    node_operator_id: IDL.Opt(IDL.Principal),
    node_allowance: IDL.Opt(IDL.Nat64),
  });
  const UpdateSubnetPayload = IDL.Record({
    unit_delay_millis: IDL.Opt(IDL.Nat64),
    max_duplicity: IDL.Opt(IDL.Nat32),
    set_gossip_config_to_default: IDL.Bool,
    pfn_evaluation_period_ms: IDL.Opt(IDL.Nat32),
    subnet_id: IDL.Principal,
    max_ingress_bytes_per_message: IDL.Opt(IDL.Nat64),
    dkg_dealings_per_block: IDL.Opt(IDL.Nat64),
    start_as_nns: IDL.Opt(IDL.Bool),
    is_halted: IDL.Opt(IDL.Bool),
    retransmission_request_ms: IDL.Opt(IDL.Nat32),
    dkg_interval_length: IDL.Opt(IDL.Nat64),
    registry_poll_period_ms: IDL.Opt(IDL.Nat32),
    max_chunk_wait_ms: IDL.Opt(IDL.Nat32),
    receive_check_cache_size: IDL.Opt(IDL.Nat32),
    ingress_bytes_per_block_soft_cap: IDL.Opt(IDL.Nat64),
    max_chunk_size: IDL.Opt(IDL.Nat32),
    initial_notary_delay_millis: IDL.Opt(IDL.Nat64),
    max_artifact_streams_per_peer: IDL.Opt(IDL.Nat32),
    subnet_type: IDL.Opt(SubnetType),
  });
  const UpdateSubnetReplicaVersionPayload = IDL.Record({
    subnet_id: IDL.Principal,
    replica_version_id: IDL.Text,
  });
  return IDL.Service({
    add_node: IDL.Func([AddNodePayload], [], []),
    add_node_operator: IDL.Func([AddNodeOperatorPayload], [], []),
    add_nodes_to_subnet: IDL.Func([AddNodesToSubnetPayload], [], []),
    bless_replica_version: IDL.Func([BlessReplicaVersionPayload], [], []),
    clear_provisional_whitelist: IDL.Func([], [], []),
    create_subnet: IDL.Func([CreateSubnetPayload], [], []),
    current_authz: IDL.Func([], [CanisterAuthzInfo], ['query']),
    recover_subnet: IDL.Func([RecoverSubnetPayload], [], []),
    remove_node: IDL.Func([RemoveNodePayload], [], []),
    remove_nodes_from_subnet: IDL.Func([RemoveNodesFromSubnetPayload], [], []),
    set_firewall_config: IDL.Func([SetFirewallConfigPayload], [], []),
    update_authz: IDL.Func([IDL.Vec(MethodAuthzChange)], [], []),
    update_icp_xdr_conversion_rate: IDL.Func(
      [UpdateIcpXdrConversionRatePayload],
      [],
      []
    ),
    update_node_operator_config: IDL.Func(
      [UpdateNodeOperatorConfigPayload],
      [],
      []
    ),
    update_subnet: IDL.Func([UpdateSubnetPayload], [], []),
    update_subnet_replica_version: IDL.Func(
      [UpdateSubnetReplicaVersionPayload],
      [],
      []
    ),
  });
};
export const init = () => {
  return [];
};
