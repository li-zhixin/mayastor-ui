import { ClusterStats } from '../types';
import { getNodes } from './nodes';
import { getPools } from './pools';
import { getVolumes } from './volumes';
import { getReplicas } from './replicas';

export async function getClusterStats(): Promise<ClusterStats> {
  const [nodes, pools, volumes, replicas] = await Promise.all([
    getNodes(),
    getPools(),
    getVolumes(),
    getReplicas(),
  ]);

  const nodesOnline = nodes.filter((n) => n.state?.status === 'Online').length;
  const poolsOnline = pools.filter((p) => p.state?.status === 'Online').length;
  const volumesOnline = volumes.filter((v) => v.state.status === 'Online').length;

  const capacityBytes = pools.reduce((sum, p) => sum + (p.state?.capacity || 0), 0);
  const usedBytes = pools.reduce((sum, p) => sum + (p.state?.used || 0), 0);

  return {
    nodes: nodes.length,
    nodesOnline,
    pools: pools.length,
    poolsOnline,
    volumes: volumes.length,
    volumesOnline,
    replicas: replicas.length,
    usedBytes,
    capacityBytes,
  };
}
