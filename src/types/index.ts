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

export type Protocol = 'None' | 'Nvmf' | 'Iscsi' | 'Nbd';

// === Node ===

export interface NodeState {
  id: NodeId;
  grpcEndpoint: string;
  status: NodeStatus;
}

export interface NodeSpec {
  id: NodeId;
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
}

export interface PoolSpec {
  id: PoolId;
  node: NodeId;
  disks: PoolDeviceUri[];
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
  name: string;
  uuid: ReplicaId;
  pool: PoolId;
  thin: boolean;
  size: number;
  share: Protocol;
  uri: string;
  status: ReplicaStatus;
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
  name: string;
  uuid: NexusId;
  size: number;
  status: NexusStatus;
  children: NexusChild[];
  deviceUri: string;
  rebuilds: number;
  share: Protocol;
}

export interface CreateNexusBody {
  size: number;
  children: ChildUri[];
}

// === Volume ===

export interface VolumePolicy {
  selfHeal?: boolean;
}

export interface VolumeState {
  uuid: VolumeId;
  size: number;
  status: VolumeStatus;
  target?: Nexus;
  replicaTopology?: Record<ReplicaId, ReplicaTopology>;
}

export interface VolumeSpec {
  uuid: VolumeId;
  size: number;
  replicas: number;
  policy: VolumePolicy;
  labels?: Record<string, string>;
  topology?: LabelledTopology;
}

export interface Volume {
  spec: VolumeSpec;
  state: VolumeState;
}

export interface CreateVolumeBody {
  size: number;
  replicas: number;
  policy: VolumePolicy;
  labels?: Record<string, string>;
}

export interface ReplicaTopology {
  node: NodeId;
  pool: PoolId;
  status: ReplicaTopologyStatus;
}

export type ReplicaTopologyStatus = 'Online' | 'Pending' | 'Degraded' | 'Faulted' | 'Unknown';

export interface LabelledTopology {
  exclusion: Record<string, string>;
  inclusion: Record<string, string>;
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
