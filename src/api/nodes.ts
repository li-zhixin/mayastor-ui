import { Node } from '../types';
import { apiGetList, apiGet } from './client';

export async function getNodes(): Promise<Node[]> {
  return apiGetList<Node>('/v0/nodes?max_entries=0');
}

export async function getNode(id: string): Promise<Node> {
  return apiGet<Node>(`/v0/nodes/${encodeURIComponent(id)}`);
}
