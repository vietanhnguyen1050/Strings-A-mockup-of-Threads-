import { useState } from "react";
import "./postCard.css";
import { AntDesignOutlined, HeartOutlined, CommentOutlined, RetweetOutlined, SendOutlined } from "@ant-design/icons";
import { Layout, Space, Divider, Avatar, Card, Typography, Button, Carousel, Image } from "antd";
const { Sider, Content } = Layout;
const { Text } = Typography;

function openPost() {
    console.log("Post clicked");
}

function PostCard() {
    return (
        <div className="post-card">
            <Layout>
                <Sider width="15%" className="sider">
                    <div className="avatar-container">
                        <Avatar
                            size={{ xs: 18, sm: 30, md: 40, lg: 50, xl: 50, xxl: 50 }}
                            icon={<AntDesignOutlined />}
                        />
                    </div>
                </Sider>
                <Layout>
                    <Content className="content">
                        <Card title={<Space className="header-text" size="large">
                            <Text style={{ color: "white" }}>Username</Text>
                            <Button color="default" variant="outlined" size="small">
                                +
                            </Button>
                            {/* Follow button */}
                            <Text style={{ color: "gray" }} type="secondary">Time</Text>
                        </Space>
                        } variant="borderless" style={{ width: '100%', borderRadius: 0, backgroundColor: '#181818ff', color: '#ffffff' }}>
                            <p>Card content</p>
                            <Carousel arrows infinite={false} onClickCapture={(e) => e.stopPropagation()}>
                                <div className="image-carousel" onClick={(e) => e.stopPropagation()}>
                                    <Image width={'100%'} src="https://tse3.mm.bing.net/th/id/OIP.YCysWiDN5r1qyfByFbx2kwHaEo?w=277&h=180&c=7&r=0&o=7&pid=1.7&rm=3" placeholder />
                                </div>
                                <div className="image-carousel" onClick={(e) => e.stopPropagation()}>
                                    <Image width={'100%'} src="https://tse2.mm.bing.net/th/id/OIP.mKj1PC1QDkFhHjTYXwa-HQHaFj?w=207&h=180&c=7&r=0&o=7&pid=1.7&rm=3" placeholder />
                                </div>
                            </Carousel>
                            <Space className="action-icons" size="small">
                                <Button shape="circle" type="text" icon={<HeartOutlined style={{ color: "white" }} />} />10
                                <Button onClick={openPost} shape="circle" type="text" icon={<CommentOutlined style={{ color: 'white' }} />} />10
                                <Button shape="circle" type="text" icon={<RetweetOutlined style={{ color: 'white' }} />} />10
                                <Button shape="circle" type="text" icon={<SendOutlined style={{ color: 'white' }} />} />10
                            </Space>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default PostCard;