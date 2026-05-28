import { Volume, VolumeId, CreateVolumeBody, PublishVolumeBody } from '../types';
import { apiGetList, apiGet, apiPut, apiDelete } from './client';

export async function getVolumes(): Promise<Volume[]> {
  return apiGetList<Volume>('/v0/volumes?max_entries=0');
}

export async function getVolume(id: VolumeId): Promise<Volume> {
  return apiGet<Volume>(`/v0/volumes/${encodeURIComponent(id)}`);
}

export async function createVolume(id: VolumeId, body: CreateVolumeBody): Promise<Volume> {
  return apiPut<Volume>(`/v0/volumes/${encodeURIComponent(id)}`, body);
}

export async function deleteVolume(id: VolumeId): Promise<void> {
  return apiDelete<void>(`/v0/volumes/${encodeURIComponent(id)}`);
}

export async function publishVolume(id: VolumeId, body: PublishVolumeBody): Promise<Volume> {
  return apiPut<Volume>(`/v0/volumes/${encodeURIComponent(id)}/target`, body);
}

export async function unpublishVolume(id: VolumeId): Promise<Volume> {
  return apiDelete<Volume>(`/v0/volumes/${encodeURIComponent(id)}/target`);
}

export async function shareVolume(id: VolumeId, protocol: string, frontendHost?: string): Promise<string> {
  const query = frontendHost ? `?frontend_host=${encodeURIComponent(frontendHost)}` : '';
  return apiPut<string>(`/v0/volumes/${encodeURIComponent(id)}/share/${encodeURIComponent(protocol)}${query}`);
}

export async function unshareVolume(id: VolumeId): Promise<void> {
  return apiDelete<void>(`/v0/volumes/${encodeURIComponent(id)}/share`);
}
