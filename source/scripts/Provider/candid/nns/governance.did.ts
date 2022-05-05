// @ts-nocheck
export default ({ IDL }) => {
  const Proposal = IDL.Rec();
  const NeuronId = IDL.Record({ id: IDL.Nat64 });
  const Followees = IDL.Record({ followees: IDL.Vec(NeuronId) });
  const NodeProvider = IDL.Record({ id: IDL.Opt(IDL.Principal) });
  const NetworkEconomics = IDL.Record({
    neuron_minimum_stake_e8s: IDL.Nat64,
    max_proposals_to_keep_per_topic: IDL.Nat32,
    neuron_management_fee_per_proposal_e8s: IDL.Nat64,
    reject_cost_e8s: IDL.Nat64,
    transaction_fee_e8s: IDL.Nat64,
    neuron_spawn_dissolve_delay_seconds: IDL.Nat64,
    minimum_icp_xdr_rate: IDL.Nat64,
    maximum_node_provider_rewards_e8s: IDL.Nat64,
  });

  const NeuronStakeTransfer = IDL.Record({
    to_subaccount: IDL.Vec(IDL.Nat8),
    neuron_stake_e8s: IDL.Nat64,
    from: IDL.Opt(IDL.Principal),
    memo: IDL.Nat64,
    from_subaccount: IDL.Vec(IDL.Nat8),
    transfer_timestamp: IDL.Nat64,
    block_height: IDL.Nat64,
  });
  const GovernanceError = IDL.Record({
    error_message: IDL.Text,
    error_type: IDL.Int32,
  });
  const Ballot = IDL.Record({ vote: IDL.Int32, voting_power: IDL.Nat64 });
  const Tally = IDL.Record({
    no: IDL.Nat64,
    yes: IDL.Nat64,
    total: IDL.Nat64,
    timestamp_seconds: IDL.Nat64,
  });
  const Spawn = IDL.Record({ new_controller: IDL.Opt(IDL.Principal) });
  const Split = IDL.Record({ amount_e8s: IDL.Nat64 });
  const Follow = IDL.Record({
    topic: IDL.Int32,
    followees: IDL.Vec(NeuronId),
  });
  const ClaimOrRefreshNeuronFromAccount = IDL.Record({
    controller: IDL.Opt(IDL.Principal),
    memo: IDL.Nat64,
  });
  const By = IDL.Variant({
    NeuronIdOrSubaccount: IDL.Record({}),
    MemoAndController: ClaimOrRefreshNeuronFromAccount,
    Memo: IDL.Nat64,
  });
  const ClaimOrRefresh = IDL.Record({ by: IDL.Opt(By) });
  const RemoveHotKey = IDL.Record({
    hot_key_to_remove: IDL.Opt(IDL.Principal),
  });
  const AddHotKey = IDL.Record({ new_hot_key: IDL.Opt(IDL.Principal) });
  const IncreaseDissolveDelay = IDL.Record({
    additional_dissolve_delay_seconds: IDL.Nat32,
  });
  const SetDissolveTimestamp = IDL.Record({
    dissolve_timestamp_seconds: IDL.Nat64,
  });
  const Operation = IDL.Variant({
    RemoveHotKey: RemoveHotKey,
    AddHotKey: AddHotKey,
    StopDissolving: IDL.Record({}),
    StartDissolving: IDL.Record({}),
    IncreaseDissolveDelay: IncreaseDissolveDelay,
    SetDissolveTimestamp: SetDissolveTimestamp,
  });
  const Configure = IDL.Record({ operation: IDL.Opt(Operation) });
  const RegisterVote = IDL.Record({
    vote: IDL.Int32,
    proposal: IDL.Opt(NeuronId),
  });
  const DisburseToNeuron = IDL.Record({
    dissolve_delay_seconds: IDL.Nat64,
    kyc_verified: IDL.Bool,
    amount_e8s: IDL.Nat64,
    new_controller: IDL.Opt(IDL.Principal),
    nonce: IDL.Nat64,
  });
  const MergeMaturity = IDL.Record({ percentage_to_merge: IDL.Nat32 });
  const AccountIdentifier = IDL.Record({ hash: IDL.Vec(IDL.Nat8) });
  const Amount = IDL.Record({ e8s: IDL.Nat64 });
  const Disburse = IDL.Record({
    to_account: IDL.Opt(AccountIdentifier),
    amount: IDL.Opt(Amount),
  });
  const Command = IDL.Variant({
    Spawn: Spawn,
    Split: Split,
    Follow: Follow,
    ClaimOrRefresh: ClaimOrRefresh,
    Configure: Configure,
    RegisterVote: RegisterVote,
    DisburseToNeuron: DisburseToNeuron,
    MakeProposal: Proposal,
    MergeMaturity: MergeMaturity,
    Disburse: Disburse,
  });
  const NeuronIdOrSubaccount = IDL.Variant({
    Subaccount: IDL.Vec(IDL.Nat8),
    NeuronId: NeuronId,
  });
  const ManageNeuron = IDL.Record({
    id: IDL.Opt(NeuronId),
    command: IDL.Opt(Command),
    neuron_id_or_subaccount: IDL.Opt(NeuronIdOrSubaccount),
  });
  const ExecuteNnsFunction = IDL.Record({
    nns_function: IDL.Int32,
    payload: IDL.Vec(IDL.Nat8),
  });
  const RewardToNeuron = IDL.Record({ dissolve_delay_seconds: IDL.Nat64 });
  const RewardToAccount = IDL.Record({
    to_account: IDL.Opt(AccountIdentifier),
  });
  const RewardMode = IDL.Variant({
    RewardToNeuron: RewardToNeuron,
    RewardToAccount: RewardToAccount,
  });
  const RewardNodeProvider = IDL.Record({
    node_provider: IDL.Opt(NodeProvider),
    reward_mode: IDL.Opt(RewardMode),
    amount_e8s: IDL.Nat64,
  });
  const SetDefaultFollowees = IDL.Record({
    default_followees: IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
  });
  const RewardNodeProviders = IDL.Record({
    rewards: IDL.Vec(RewardNodeProvider),
  });
  const ApproveGenesisKyc = IDL.Record({
    principals: IDL.Vec(IDL.Principal),
  });
  const Change = IDL.Variant({
    ToRemove: NodeProvider,
    ToAdd: NodeProvider,
  });
  const AddOrRemoveNodeProvider = IDL.Record({ change: IDL.Opt(Change) });
  const Motion = IDL.Record({ motion_text: IDL.Text });
  const Action = IDL.Variant({
    ManageNeuron: ManageNeuron,
    ExecuteNnsFunction: ExecuteNnsFunction,
    RewardNodeProvider: RewardNodeProvider,
    SetDefaultFollowees: SetDefaultFollowees,
    RewardNodeProviders: RewardNodeProviders,
    ManageNetworkEconomics: NetworkEconomics,
    ApproveGenesisKyc: ApproveGenesisKyc,
    AddOrRemoveNodeProvider: AddOrRemoveNodeProvider,
    Motion: Motion,
  });
  Proposal.fill(
    IDL.Record({
      url: IDL.Text,
      action: IDL.Opt(Action),
      summary: IDL.Text,
    })
  );

  const BallotInfo = IDL.Record({
    vote: IDL.Int32,
    proposal_id: IDL.Opt(NeuronId),
  });
  const DissolveState = IDL.Variant({
    DissolveDelaySeconds: IDL.Nat64,
    WhenDissolvedTimestampSeconds: IDL.Nat64,
  });
  const Neuron = IDL.Record({
    id: IDL.Opt(NeuronId),
    controller: IDL.Opt(IDL.Principal),
    recent_ballots: IDL.Vec(BallotInfo),
    kyc_verified: IDL.Bool,
    not_for_profit: IDL.Bool,
    maturity_e8s_equivalent: IDL.Nat64,
    cached_neuron_stake_e8s: IDL.Nat64,
    created_timestamp_seconds: IDL.Nat64,
    aging_since_timestamp_seconds: IDL.Nat64,
    hot_keys: IDL.Vec(IDL.Principal),
    account: IDL.Vec(IDL.Nat8),
    dissolve_state: IDL.Opt(DissolveState),
    followees: IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
    neuron_fees_e8s: IDL.Nat64,
    transfer: IDL.Opt(NeuronStakeTransfer),
  });

  const Result = IDL.Variant({ Ok: IDL.Null, Err: GovernanceError });
  const Result_1 = IDL.Variant({
    Error: GovernanceError,
    NeuronId: NeuronId,
  });
  const ClaimOrRefreshNeuronFromAccountResponse = IDL.Record({
    result: IDL.Opt(Result_1),
  });
  const Result_2 = IDL.Variant({ Ok: Neuron, Err: GovernanceError });
  const NeuronInfo = IDL.Record({
    dissolve_delay_seconds: IDL.Nat64,
    recent_ballots: IDL.Vec(BallotInfo),
    created_timestamp_seconds: IDL.Nat64,
    state: IDL.Int32,
    retrieved_at_timestamp_seconds: IDL.Nat64,
    voting_power: IDL.Nat64,
    age_seconds: IDL.Nat64,
  });
  const Result_3 = IDL.Variant({ Ok: NeuronInfo, Err: GovernanceError });
  const ProposalInfo = IDL.Record({
    id: IDL.Opt(NeuronId),
    status: IDL.Int32,
    topic: IDL.Int32,
    failure_reason: IDL.Opt(GovernanceError),
    ballots: IDL.Vec(IDL.Tuple(IDL.Nat64, Ballot)),
    proposal_timestamp_seconds: IDL.Nat64,
    reward_event_round: IDL.Nat64,
    failed_timestamp_seconds: IDL.Nat64,
    reject_cost_e8s: IDL.Nat64,
    latest_tally: IDL.Opt(Tally),
    reward_status: IDL.Int32,
    decided_timestamp_seconds: IDL.Nat64,
    proposal: IDL.Opt(Proposal),
    proposer: IDL.Opt(NeuronId),
    executed_timestamp_seconds: IDL.Nat64,
  });
  const ListNeurons = IDL.Record({
    neuron_ids: IDL.Vec(IDL.Nat64),
    include_neurons_readable_by_caller: IDL.Bool,
  });
  const ListNeuronsResponse = IDL.Record({
    neuron_infos: IDL.Vec(IDL.Tuple(IDL.Nat64, NeuronInfo)),
    full_neurons: IDL.Vec(Neuron),
  });
  const ListProposalInfo = IDL.Record({
    include_reward_status: IDL.Vec(IDL.Int32),
    before_proposal: IDL.Opt(NeuronId),
    limit: IDL.Nat32,
    exclude_topic: IDL.Vec(IDL.Int32),
    include_status: IDL.Vec(IDL.Int32),
  });
  const ListProposalInfoResponse = IDL.Record({
    proposal_info: IDL.Vec(ProposalInfo),
  });
  const SpawnResponse = IDL.Record({ created_neuron_id: IDL.Opt(NeuronId) });
  const ClaimOrRefreshResponse = IDL.Record({
    refreshed_neuron_id: IDL.Opt(NeuronId),
  });
  const MakeProposalResponse = IDL.Record({
    proposal_id: IDL.Opt(NeuronId),
  });
  const MergeMaturityResponse = IDL.Record({
    merged_maturity_e8s: IDL.Nat64,
    new_stake_e8s: IDL.Nat64,
  });
  const DisburseResponse = IDL.Record({ transfer_block_height: IDL.Nat64 });
  const Command_1 = IDL.Variant({
    Error: GovernanceError,
    Spawn: SpawnResponse,
    Split: SpawnResponse,
    Follow: IDL.Record({}),
    ClaimOrRefresh: ClaimOrRefreshResponse,
    Configure: IDL.Record({}),
    RegisterVote: IDL.Record({}),
    DisburseToNeuron: SpawnResponse,
    MakeProposal: MakeProposalResponse,
    MergeMaturity: MergeMaturityResponse,
    Disburse: DisburseResponse,
  });
  const ManageNeuronResponse = IDL.Record({ command: IDL.Opt(Command_1) });
  return IDL.Service({
    claim_gtc_neurons: IDL.Func(
      [IDL.Principal, IDL.Vec(NeuronId)],
      [Result],
      []
    ),
    claim_or_refresh_neuron_from_account: IDL.Func(
      [ClaimOrRefreshNeuronFromAccount],
      [ClaimOrRefreshNeuronFromAccountResponse],
      []
    ),
    get_full_neuron: IDL.Func([IDL.Nat64], [Result_2], ['query']),
    get_neuron_ids: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
    get_neuron_info: IDL.Func([IDL.Nat64], [Result_3], ['query']),
    get_pending_proposals: IDL.Func([], [IDL.Vec(ProposalInfo)], ['query']),
    get_proposal_info: IDL.Func(
      [IDL.Nat64],
      [IDL.Opt(ProposalInfo)],
      ['query']
    ),
    list_neurons: IDL.Func([ListNeurons], [ListNeuronsResponse], ['query']),
    list_proposals: IDL.Func(
      [ListProposalInfo],
      [ListProposalInfoResponse],
      ['query']
    ),
    manage_neuron: IDL.Func([ManageNeuron], [ManageNeuronResponse], []),
    transfer_gtc_neuron: IDL.Func([NeuronId, NeuronId], [Result], []),
  });
};
export const init = ({ IDL }) => {
  const Proposal = IDL.Rec();
  const NeuronId = IDL.Record({ id: IDL.Nat64 });
  const Followees = IDL.Record({ followees: IDL.Vec(NeuronId) });
  const NodeProvider = IDL.Record({ id: IDL.Opt(IDL.Principal) });
  const NetworkEconomics = IDL.Record({
    neuron_minimum_stake_e8s: IDL.Nat64,
    max_proposals_to_keep_per_topic: IDL.Nat32,
    neuron_management_fee_per_proposal_e8s: IDL.Nat64,
    reject_cost_e8s: IDL.Nat64,
    transaction_fee_e8s: IDL.Nat64,
    neuron_spawn_dissolve_delay_seconds: IDL.Nat64,
    minimum_icp_xdr_rate: IDL.Nat64,
    maximum_node_provider_rewards_e8s: IDL.Nat64,
  });
  const RewardEvent = IDL.Record({
    day_after_genesis: IDL.Nat64,
    actual_timestamp_seconds: IDL.Nat64,
    distributed_e8s_equivalent: IDL.Nat64,
    settled_proposals: IDL.Vec(NeuronId),
  });
  const NeuronStakeTransfer = IDL.Record({
    to_subaccount: IDL.Vec(IDL.Nat8),
    neuron_stake_e8s: IDL.Nat64,
    from: IDL.Opt(IDL.Principal),
    memo: IDL.Nat64,
    from_subaccount: IDL.Vec(IDL.Nat8),
    transfer_timestamp: IDL.Nat64,
    block_height: IDL.Nat64,
  });
  const GovernanceError = IDL.Record({
    error_message: IDL.Text,
    error_type: IDL.Int32,
  });
  const Ballot = IDL.Record({ vote: IDL.Int32, voting_power: IDL.Nat64 });
  const Tally = IDL.Record({
    no: IDL.Nat64,
    yes: IDL.Nat64,
    total: IDL.Nat64,
    timestamp_seconds: IDL.Nat64,
  });
  const Spawn = IDL.Record({ new_controller: IDL.Opt(IDL.Principal) });
  const Split = IDL.Record({ amount_e8s: IDL.Nat64 });
  const Follow = IDL.Record({
    topic: IDL.Int32,
    followees: IDL.Vec(NeuronId),
  });
  const ClaimOrRefreshNeuronFromAccount = IDL.Record({
    controller: IDL.Opt(IDL.Principal),
    memo: IDL.Nat64,
  });
  const By = IDL.Variant({
    NeuronIdOrSubaccount: IDL.Record({}),
    MemoAndController: ClaimOrRefreshNeuronFromAccount,
    Memo: IDL.Nat64,
  });
  const ClaimOrRefresh = IDL.Record({ by: IDL.Opt(By) });
  const RemoveHotKey = IDL.Record({
    hot_key_to_remove: IDL.Opt(IDL.Principal),
  });
  const AddHotKey = IDL.Record({ new_hot_key: IDL.Opt(IDL.Principal) });
  const IncreaseDissolveDelay = IDL.Record({
    additional_dissolve_delay_seconds: IDL.Nat32,
  });
  const SetDissolveTimestamp = IDL.Record({
    dissolve_timestamp_seconds: IDL.Nat64,
  });
  const Operation = IDL.Variant({
    RemoveHotKey: RemoveHotKey,
    AddHotKey: AddHotKey,
    StopDissolving: IDL.Record({}),
    StartDissolving: IDL.Record({}),
    IncreaseDissolveDelay: IncreaseDissolveDelay,
    SetDissolveTimestamp: SetDissolveTimestamp,
  });
  const Configure = IDL.Record({ operation: IDL.Opt(Operation) });
  const RegisterVote = IDL.Record({
    vote: IDL.Int32,
    proposal: IDL.Opt(NeuronId),
  });
  const DisburseToNeuron = IDL.Record({
    dissolve_delay_seconds: IDL.Nat64,
    kyc_verified: IDL.Bool,
    amount_e8s: IDL.Nat64,
    new_controller: IDL.Opt(IDL.Principal),
    nonce: IDL.Nat64,
  });
  const MergeMaturity = IDL.Record({ percentage_to_merge: IDL.Nat32 });
  const AccountIdentifier = IDL.Record({ hash: IDL.Vec(IDL.Nat8) });
  const Amount = IDL.Record({ e8s: IDL.Nat64 });
  const Disburse = IDL.Record({
    to_account: IDL.Opt(AccountIdentifier),
    amount: IDL.Opt(Amount),
  });
  const Command = IDL.Variant({
    Spawn: Spawn,
    Split: Split,
    Follow: Follow,
    ClaimOrRefresh: ClaimOrRefresh,
    Configure: Configure,
    RegisterVote: RegisterVote,
    DisburseToNeuron: DisburseToNeuron,
    MakeProposal: Proposal,
    MergeMaturity: MergeMaturity,
    Disburse: Disburse,
  });
  const NeuronIdOrSubaccount = IDL.Variant({
    Subaccount: IDL.Vec(IDL.Nat8),
    NeuronId: NeuronId,
  });
  const ManageNeuron = IDL.Record({
    id: IDL.Opt(NeuronId),
    command: IDL.Opt(Command),
    neuron_id_or_subaccount: IDL.Opt(NeuronIdOrSubaccount),
  });
  const ExecuteNnsFunction = IDL.Record({
    nns_function: IDL.Int32,
    payload: IDL.Vec(IDL.Nat8),
  });
  const RewardToNeuron = IDL.Record({ dissolve_delay_seconds: IDL.Nat64 });
  const RewardToAccount = IDL.Record({
    to_account: IDL.Opt(AccountIdentifier),
  });
  const RewardMode = IDL.Variant({
    RewardToNeuron: RewardToNeuron,
    RewardToAccount: RewardToAccount,
  });
  const RewardNodeProvider = IDL.Record({
    node_provider: IDL.Opt(NodeProvider),
    reward_mode: IDL.Opt(RewardMode),
    amount_e8s: IDL.Nat64,
  });
  const SetDefaultFollowees = IDL.Record({
    default_followees: IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
  });
  const RewardNodeProviders = IDL.Record({
    rewards: IDL.Vec(RewardNodeProvider),
  });
  const ApproveGenesisKyc = IDL.Record({
    principals: IDL.Vec(IDL.Principal),
  });
  const Change = IDL.Variant({
    ToRemove: NodeProvider,
    ToAdd: NodeProvider,
  });
  const AddOrRemoveNodeProvider = IDL.Record({ change: IDL.Opt(Change) });
  const Motion = IDL.Record({ motion_text: IDL.Text });
  const Action = IDL.Variant({
    ManageNeuron: ManageNeuron,
    ExecuteNnsFunction: ExecuteNnsFunction,
    RewardNodeProvider: RewardNodeProvider,
    SetDefaultFollowees: SetDefaultFollowees,
    RewardNodeProviders: RewardNodeProviders,
    ManageNetworkEconomics: NetworkEconomics,
    ApproveGenesisKyc: ApproveGenesisKyc,
    AddOrRemoveNodeProvider: AddOrRemoveNodeProvider,
    Motion: Motion,
  });
  Proposal.fill(
    IDL.Record({
      url: IDL.Text,
      action: IDL.Opt(Action),
      summary: IDL.Text,
    })
  );
  const ProposalData = IDL.Record({
    id: IDL.Opt(NeuronId),
    failure_reason: IDL.Opt(GovernanceError),
    ballots: IDL.Vec(IDL.Tuple(IDL.Nat64, Ballot)),
    proposal_timestamp_seconds: IDL.Nat64,
    reward_event_round: IDL.Nat64,
    failed_timestamp_seconds: IDL.Nat64,
    reject_cost_e8s: IDL.Nat64,
    latest_tally: IDL.Opt(Tally),
    decided_timestamp_seconds: IDL.Nat64,
    proposal: IDL.Opt(Proposal),
    proposer: IDL.Opt(NeuronId),
    executed_timestamp_seconds: IDL.Nat64,
  });
  const Command_2 = IDL.Variant({
    Spawn: Spawn,
    Split: Split,
    DisburseToNeuron: DisburseToNeuron,
    ClaimOrRefreshNeuron: ClaimOrRefresh,
    MergeMaturity: MergeMaturity,
    Disburse: Disburse,
  });
  const NeuronInFlightCommand = IDL.Record({
    command: IDL.Opt(Command_2),
    timestamp: IDL.Nat64,
  });
  const BallotInfo = IDL.Record({
    vote: IDL.Int32,
    proposal_id: IDL.Opt(NeuronId),
  });
  const DissolveState = IDL.Variant({
    DissolveDelaySeconds: IDL.Nat64,
    WhenDissolvedTimestampSeconds: IDL.Nat64,
  });
  const Neuron = IDL.Record({
    id: IDL.Opt(NeuronId),
    controller: IDL.Opt(IDL.Principal),
    recent_ballots: IDL.Vec(BallotInfo),
    kyc_verified: IDL.Bool,
    not_for_profit: IDL.Bool,
    maturity_e8s_equivalent: IDL.Nat64,
    cached_neuron_stake_e8s: IDL.Nat64,
    created_timestamp_seconds: IDL.Nat64,
    aging_since_timestamp_seconds: IDL.Nat64,
    hot_keys: IDL.Vec(IDL.Principal),
    account: IDL.Vec(IDL.Nat8),
    dissolve_state: IDL.Opt(DissolveState),
    followees: IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
    neuron_fees_e8s: IDL.Nat64,
    transfer: IDL.Opt(NeuronStakeTransfer),
  });
  const Governance = IDL.Record({
    default_followees: IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
    wait_for_quiet_threshold_seconds: IDL.Nat64,
    node_providers: IDL.Vec(NodeProvider),
    economics: IDL.Opt(NetworkEconomics),
    latest_reward_event: IDL.Opt(RewardEvent),
    to_claim_transfers: IDL.Vec(NeuronStakeTransfer),
    short_voting_period_seconds: IDL.Nat64,
    proposals: IDL.Vec(IDL.Tuple(IDL.Nat64, ProposalData)),
    in_flight_commands: IDL.Vec(IDL.Tuple(IDL.Nat64, NeuronInFlightCommand)),
    neurons: IDL.Vec(IDL.Tuple(IDL.Nat64, Neuron)),
    genesis_timestamp_seconds: IDL.Nat64,
  });
  return [Governance];
};
