import { useState } from 'react';
import { Layout as AntLayout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  HddOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '概览' },
  { key: '/nodes', icon: <ClusterOutlined />, label: '节点' },
  { key: '/pools', icon: <DatabaseOutlined />, label: '存储池' },
  { key: '/volumes', icon: <HddOutlined />, label: '卷' },
  { key: '/replicas', icon: <CopyOutlined />, label: '副本' },
  { key: '/nexuses', icon: <ShareAltOutlined />, label: 'Nexus' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = '/' + location.pathname.split('/')[1];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography.Title
            level={4}
            style={{ color: '#fff', margin: 0, fontSize: collapsed ? 14 : 16 }}
          >
            {collapsed ? 'M' : 'Mayastor'}
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            Mayastor 存储集群管理
          </Typography.Text>
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
