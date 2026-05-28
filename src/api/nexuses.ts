import { Nexus, NexusId, CreateNexusBody, ChildUri } from '../types';
import { apiGetList, apiGet, apiPut, apiDelete } from './client';

export async function getNexuses(): Promise<Nexus[]> {
  return apiGetList<Nexus>('/v0/nexuses?max_entries=0');
}

export async function getNexus(id: NexusId): Promise<Nexus> {
  return apiGet<Nexus>(`/v0/nexuses/${encodeURIComponent(id)}`);
}

export async function createNexus(node: string, uuid: string, body: CreateNexusBody): Promise<Nexus> {
  return apiPut<Nexus>(`/v0/nodes/${encodeURIComponent(node)}/nexuses/${encodeURIComponent(uuid)}`, body);
}

export async function deleteNexus(node: string, uuid: string): Promise<void> {
  return apiDelete<void>(`/v0/nodes/${encodeURIComponent(node)}/nexuses/${encodeURIComponent(uuid)}`);
}

export async function addNexusChild(node: string, uuid: string, uri: ChildUri): Promise<Nexus> {
  return apiPut<Nexus>(
    `/v0/nodes/${encodeURIComponent(node)}/nexuses/${encodeURIComponent(uuid)}/children/${encodeURIComponent(uri)}`,
  );
}

export async function removeNexusChild(node: string, uuid: string, uri: ChildUri): Promise<Nexus> {
  return apiDelete<Nexus>(
    `/v0/nodes/${encodeURIComponent(node)}/nexuses/${encodeURIComponent(uuid)}/children/${encodeURIComponent(uri)}`,
  );
}
