import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NodesPage from './pages/Nodes';
import PoolsPage from './pages/Pools';
import VolumesPage from './pages/Volumes';
import VolumeDetail from './pages/Volumes/VolumeDetail';
import ReplicasPage from './pages/Replicas';
import NexusesPage from './pages/Nexuses';
import NexusDetail from './pages/Nexuses/NexusDetail';
import { getBasePath } from './config';

export default function App() {
  const { i18n, t } = useTranslation();
  const antdLocale = i18n.resolvedLanguage === 'zh-CN' ? zhCN : enUS;
  const basePath = getBasePath();

  useEffect(() => {
    document.title = t('common.appTitle');
  }, [t, i18n.resolvedLanguage]);

  return (
    <ConfigProvider locale={antdLocale}>
      <BrowserRouter basename={basePath}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route path="/pools" element={<PoolsPage />} />
            <Route path="/volumes" element={<VolumesPage />} />
            <Route path="/volumes/:id" element={<VolumeDetail />} />
            <Route path="/replicas" element={<ReplicasPage />} />
            <Route path="/nexuses" element={<NexusesPage />} />
            <Route path="/nexuses/:id" element={<NexusDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
