import { Volume, VolumeId, CreateVolumeBody } from '../types';
import { apiGetList, apiGet, apiPost, apiDelete } from './client';

export async function getVolumes(): Promise<Volume[]> {
  return apiGetList<Volume>('/v0/volumes?max_entries=0');
}

export async function getVolume(id: VolumeId): Promise<Volume> {
  return apiGet<Volume>(`/v0/volumes/${encodeURIComponent(id)}`);
}

export async function createVolume(body: CreateVolumeBody): Promise<Volume> {
  return apiPost<Volume>('/v0/volumes', body);
}

export async function deleteVolume(id: VolumeId): Promise<void> {
  return apiDelete<void>(`/v0/volumes/${encodeURIComponent(id)}`);
}

export async function publishVolume(id: VolumeId): Promise<Volume> {
  return apiPost<Volume>(`/v0/volumes/${encodeURIComponent(id)}/publish`);
}

export async function unpublishVolume(id: VolumeId): Promise<Volume> {
  return apiPost<Volume>(`/v0/volumes/${encodeURIComponent(id)}/unpublish`);
}

export async function shareVolume(id: VolumeId, protocol: string): Promise<Volume> {
  return apiPost<Volume>(`/v0/volumes/${encodeURIComponent(id)}/share`, { protocol });
}

export async function unshareVolume(id: VolumeId): Promise<Volume> {
  return apiPost<Volume>(`/v0/volumes/${encodeURIComponent(id)}/unshare`);
}
