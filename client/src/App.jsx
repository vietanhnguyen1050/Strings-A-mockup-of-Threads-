import { useState } from 'react';
import { DownCircleOutlined, HomeFilled, SearchOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Space, Flex, Button, Divider } from 'antd';
import './App.css';
import PostCard from './components/postCard';

function App() {
  const { Sider, Content } = Layout;

  const contentStyle = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#000000ff',
    minHeight: '500px',
    marginLeft: '10vh',
    justifyItems: 'center',
  };
  const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#000000ff',
    maxWidth: '10vh',
    width: '10vh',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    bottom: 0,
  };
  const textStyle = {
    color: '#ffff',
    fontSize: '22px',
  };
  const dropdownStyle = {
    backgroundColor: '#000000ff',
  };
  const items = [
    {
      label: (
        <a href="#" target="_blank" rel="noopener noreferrer">
          Create Post
        </a>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <a href="#" target="_blank" rel="noopener noreferrer">
          For You
        </a>
      ),
      key: '1',
    },
    {
      label: (
        <a href="#" target="_blank" rel="noopener noreferrer">
          Following
        </a>
      ),
      key: '2',
    },
  ];

  return (
    <Layout>
      <Sider width={'10vh'} style={siderStyle}>
        <Button className='siderButton'>
          <img src="./src/assets/strings.jpg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Button>
        <Flex justify="center" align="center" style={{ height: '80vh' }} width={'100%'} gap={'large'} vertical>
          <Button className='siderButton' icon={<HomeFilled />}></Button>
          <Button className='siderButton' icon={<SearchOutlined />}></Button>
          <Button className='siderButton'>+</Button>
          <Button className='siderButton' icon={<HeartOutlined />}></Button>
          <Button className='siderButton' icon={<UserOutlined />}></Button>
        </Flex>
      </Sider>
      <Content style={contentStyle}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <a href="#" style={textStyle}>For you </a>
          <Space separator={<Divider vertical />} style={{width: "10px"}}> </Space>
          <Dropdown menu={{ items }} trigger={['click']} popupClassName="dropdownStyle">
            <a onClick={e => e.preventDefault()}>
              <Space style={{fontSize: '18px', color: '#ffffff'}}>
                <DownCircleOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Flex vertical align='center' style={{width: '100%'}}>
          <PostCard />
          <PostCard />
        </Flex>
      </Content>
    </Layout>
  );
}

export default App
