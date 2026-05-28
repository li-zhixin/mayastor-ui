import { common as commonEn } from './locales/en/common';
import { layout as layoutEn } from './locales/en/layout';
import { dashboard as dashboardEn } from './locales/en/dashboard';
import { nodes as nodesEn } from './locales/en/nodes';
import { pools as poolsEn } from './locales/en/pools';
import { replicas as replicasEn } from './locales/en/replicas';
import { nexuses as nexusesEn } from './locales/en/nexuses';
import { volumes as volumesEn } from './locales/en/volumes';
import { common as commonZh } from './locales/zh-CN/common';
import { layout as layoutZh } from './locales/zh-CN/layout';
import { dashboard as dashboardZh } from './locales/zh-CN/dashboard';
import { nodes as nodesZh } from './locales/zh-CN/nodes';
import { pools as poolsZh } from './locales/zh-CN/pools';
import { replicas as replicasZh } from './locales/zh-CN/replicas';
import { nexuses as nexusesZh } from './locales/zh-CN/nexuses';
import { volumes as volumesZh } from './locales/zh-CN/volumes';

export const resources = {
  en: {
    translation: {
      common: commonEn,
      layout: layoutEn,
      dashboard: dashboardEn,
      nodes: nodesEn,
      pools: poolsEn,
      replicas: replicasEn,
      nexuses: nexusesEn,
      volumes: volumesEn,
    },
  },
  'zh-CN': {
    translation: {
      common: commonZh,
      layout: layoutZh,
      dashboard: dashboardZh,
      nodes: nodesZh,
      pools: poolsZh,
      replicas: replicasZh,
      nexuses: nexusesZh,
      volumes: volumesZh,
    },
  },
} as const;
