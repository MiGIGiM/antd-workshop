import { Layout } from 'antd';
import { useState } from 'react';
import NavItems from '../components/NavItems';
import { Link, Outlet } from 'react-router-dom';
import ViteLogo from '../assets/vite.svg?react';

const { Content, Footer, Header, Sider } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <Layout className="min-h-screen">
            <Sider
                className="py-5"
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                trigger={null}
            >
                <Link to="/">
                    <ViteLogo className="mx-auto mb-5" fontSize={30} />
                </Link>
                <NavItems collapsed={collapsed} />
            </Sider>
            <Layout>
                <Header>Header</Header>
                <Content>
                    <Outlet />
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
