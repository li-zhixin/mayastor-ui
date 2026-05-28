import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NodesPage from './pages/Nodes';
import PoolsPage from './pages/Pools';
import VolumesPage from './pages/Volumes';
import VolumeDetail from './pages/Volumes/VolumeDetail';
import ReplicasPage from './pages/Replicas';
import NexusesPage from './pages/Nexuses';
import NexusDetail from './pages/Nexuses/NexusDetail';

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
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
