import { HomeOutlined, FieldTimeOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from "react";
import HeadMeta from './HeadMeta';
import { useRouter } from 'next/router';


function MyHeader({ commits }) {
    const router = useRouter();
    const [currentMenuKey, setCurrentMenuKey] = useState("home")
    const items = [
        {
            label: "LFortran",
            key: "home",
            icon: <HomeOutlined />,
            onClick: () => { router.push("/").then(() => router.reload()); }
        },
        {
            label: `Commits`,
            key: 'commits',
            children: commits.map((commit) => {
                return {
                    label: commit.date,
                    key: commit.commit,
                    onClick: () => { router.push(`/commits/${commit.commit}`).then(() => router.reload()) }
                }
            }),
            icon: <><FieldTimeOutlined /> {commits.length}</>,
        }
    ]

    return (
        <>
            <HeadMeta />
            <Menu theme='dark' selectedKeys={[currentMenuKey]} mode="horizontal" items={items} />
        </>
    );
}

export default MyHeader;
