// Core Mayastor data types derived from the Rust control-plane types
// Source: github.com/openebs/mayastor-control-plane

// === Common ===

export type NodeId = string;
export type PoolId = string;
export type VolumeId = string;
export type ReplicaId = string;
export type NexusId = string;
export type PoolDeviceUri = string;
export type ChildUri = string;

// === Status Enums ===

export type NodeStatus = 'Unknown' | 'Online' | 'Offline';

export type PoolStatus = 'Unknown' | 'Online' | 'Degraded' | 'Faulted';

export type NexusStatus = 'Unknown' | 'Online' | 'Degraded' | 'Faulted';

export type VolumeStatus = NexusStatus;

export type ReplicaStatus = 'Online' | 'Degraded' | 'Faulted';
export type Protocol = 'none' | 'nvmf' | 'iscsi' | 'nbd';

// === Node ===

export interface NodeState {
  id: NodeId;
  grpcEndpoint: string;
  status: NodeStatus;
  node_nqn?: string;
  version?: string;
}

export interface NodeSpec {
  id: NodeId;
  grpcEndpoint?: string;
  node_nqn?: string;
  version?: string;
}

export interface Node {
  id: NodeId;
  spec?: NodeSpec;
  state?: NodeState;
}

// === Pool ===

export interface PoolState {
  node: NodeId;
  id: PoolId;
  disks: PoolDeviceUri[];
  status: PoolStatus;
  capacity: number;
  used: number;
  committed?: number;
  encrypted?: boolean;
  clusterSize?: number;
  diskCapacity?: number;
  maxExpandableSize?: number;
}

export interface PoolSpec {
  id: PoolId;
  node: NodeId;
  disks: PoolDeviceUri[];
  status?: string;
  clusterSize?: number;
  labels?: Record<string, string>;
}

export interface Pool {
  id: PoolId;
  spec?: PoolSpec;
  state?: PoolState;
}

// === Replica ===

export interface Replica {
  node: NodeId;
  uuid: ReplicaId;
  pool: PoolId;
  poolUuid?: string;
  thin: boolean;
  size: number;
  share: Protocol;
  uri: string;
  state: ReplicaStatus;
  kind?: string;
  encrypted?: boolean;
  space?: {
    capacity_bytes: number;
    allocated_bytes: number;
    allocated_bytes_snapshots: number;
    allocated_bytes_all_snapshots: number;
    cluster_size: number;
    clusters: number;
    allocated_clusters: number;
  };
}

export interface CreateReplicaBody {
  size: number;
  thin: boolean;
  share: Protocol;
}

// === Nexus ===

export interface NexusChild {
  uri: ChildUri;
  state: ChildState;
  rebuildProgress?: number;
}

export type ChildState = 'Online' | 'Degraded' | 'Faulted' | 'Unknown';

export interface Nexus {
  node: NodeId;
  uuid: NexusId;
  size: number;
  state: NexusStatus;
  children: NexusChild[];
  deviceUri: string;
  rebuilds: number;
  protocol: string;
}

export interface CreateNexusBody {
  size: number;
  children: ChildUri[];
}

// === Volume ===

export interface VolumePolicy {
  self_heal?: boolean;
}

export interface VolumeState {
  uuid: VolumeId;
  size: number;
  status: VolumeStatus;
  target?: Nexus;
  replica_topology?: Record<ReplicaId, ReplicaTopology>;
}

export interface VolumeSpec {
  uuid: VolumeId;
  size: number;
  num_replicas: number;
  status?: string;
  policy: VolumePolicy;
  labels?: Record<string, string>;
  topology?: VolumeTopology;
  target?: {
    node: NodeId;
    protocol: Protocol;
    frontend_nodes?: Array<{
      name: string;
      nqn: string;
    }>;
  };
  thin?: boolean;
  num_snapshots?: number;
  encrypted?: boolean;
}

export interface Volume {
  spec: VolumeSpec;
  state: VolumeState;
}

export interface CreateVolumeBody {
  size: number;
  replicas: number;
  policy: VolumePolicy;
  topology?: VolumeTopology;
  labels?: Record<string, string>;
  thin?: boolean;
  max_snapshots?: number;
  encrypted?: boolean;
  cluster_size?: number;
}

export interface PublishVolumeBody {
  protocol: 'nvmf';
  node?: NodeId;
  republish?: boolean;
  reuse_existing?: boolean;
  frontend_node?: string;
  publish_context?: Record<string, string>;
}

export interface ReplicaTopology {
  node: NodeId;
  pool: PoolId;
  state: ReplicaTopologyStatus;
  'child-status'?: string;
  usage?: {
    capacity: number;
    allocated: number;
    allocated_snapshots: number;
    allocated_all_snapshots: number;
  };
  healthy?: boolean;
  encrypted?: boolean;
}

export type ReplicaTopologyStatus = 'Online' | 'Pending' | 'Degraded' | 'Faulted' | 'Unknown';

export interface LabelledTopology {
  exclusion: Record<string, string>;
  inclusion: Record<string, string>;
}

export interface VolumeTopology {
  node_topology?: {
    labelled?: LabelledTopology;
  };
  pool_topology?: {
    labelled?: LabelledTopology;
  };
}

// === Block Device ===

export interface BlockDevice {
  devname: string;
  devtype: string;
  devmajor: number;
  devminor: number;
  size: number;
  available: boolean;
  filesystem?: FilesystemInfo;
  model?: string;
  serial?: string;
}

export interface FilesystemInfo {
  fstype: string;
  mountpoint: string;
}

// === Stats / Dashboard ===

export interface ClusterStats {
  nodes: number;
  nodesOnline: number;
  pools: number;
  poolsOnline: number;
  volumes: number;
  volumesOnline: number;
  replicas: number;
  usedBytes: number;
  capacityBytes: number;
}

// === API Error ===

export interface ApiError {
  kind: string;
  message: string;
  details?: string;
}
