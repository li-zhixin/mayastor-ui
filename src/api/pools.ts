import { Pool, PoolDeviceUri } from '../types';
import { apiGetList, apiGet, apiPost, apiDelete } from './client';

export async function getPools(): Promise<Pool[]> {
  return apiGetList<Pool>('/v0/pools?max_entries=0');
}

export async function getPool(id: string): Promise<Pool> {
  return apiGet<Pool>(`/v0/pools/${encodeURIComponent(id)}`);
}

export interface CreatePoolRequest {
  node: string;
  pool: string;
  disks: PoolDeviceUri[];
  labels?: Record<string, string>;
}

export async function createPool(params: CreatePoolRequest): Promise<Pool> {
  return apiPost<Pool>(`/v0/nodes/${encodeURIComponent(params.node)}/pools`, {
    pool: params.pool,
    disks: params.disks,
    labels: params.labels,
  });
}

export async function deletePool(node: string, pool: string): Promise<void> {
  return apiDelete<void>(`/v0/nodes/${encodeURIComponent(node)}/pools/${encodeURIComponent(pool)}`);
}
