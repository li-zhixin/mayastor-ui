import { Replica, CreateReplicaBody } from '../types';
import { apiGetList, apiGet, apiPost, apiDelete } from './client';

export async function getReplicas(): Promise<Replica[]> {
  return apiGetList<Replica>('/v0/replicas?max_entries=0');
}

export async function getReplica(id: string): Promise<Replica> {
  return apiGet<Replica>(`/v0/replicas/${encodeURIComponent(id)}`);
}

export interface CreateReplicaRequest {
  node: string;
  pool: string;
  uuid: string;
  body: CreateReplicaBody;
}

export async function createReplica(params: CreateReplicaRequest): Promise<Replica> {
  return apiPost<Replica>(
    `/v0/nodes/${encodeURIComponent(params.node)}/pools/${encodeURIComponent(params.pool)}/replicas`,
    { ...params.body, uuid: params.uuid },
  );
}

export async function deleteReplica(node: string, pool: string, uuid: string): Promise<void> {
  return apiDelete<void>(
    `/v0/nodes/${encodeURIComponent(node)}/pools/${encodeURIComponent(pool)}/replicas/${encodeURIComponent(uuid)}`,
  );
}
