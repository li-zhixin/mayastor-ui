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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const { Header, Sider, Content } = AntLayout;

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const selectedKey = '/' + location.pathname.split('/')[1];
  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: t('layout.menu.dashboard') },
    { key: '/nodes', icon: <ClusterOutlined />, label: t('layout.menu.nodes') },
    { key: '/pools', icon: <DatabaseOutlined />, label: t('layout.menu.pools') },
    { key: '/volumes', icon: <HddOutlined />, label: t('layout.menu.volumes') },
    { key: '/replicas', icon: <CopyOutlined />, label: t('layout.menu.replicas') },
    { key: '/nexuses', icon: <ShareAltOutlined />, label: t('layout.menu.nexuses') },
  ];

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
            {collapsed ? t('layout.collapsedBrand') : t('layout.brand')}
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
            justifyContent: 'space-between',
          }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            {t('layout.title')}
          </Typography.Text>
          <LanguageSwitcher />
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
