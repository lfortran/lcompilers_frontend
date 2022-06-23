import { HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from "react";
import HeadMeta from './HeadMeta';

const items = [
    {
        label: <><HomeOutlined /> LFortran</>,
        key: "1"
    }
]
function MyHeader() {
    const [current, setCurrent] = useState("1")
    return (
        <>
            <HeadMeta />
            <Menu theme='dark' selectedKeys={[current]} mode="horizontal" items={items} />
        </>
    );
}

export default MyHeader;
