import { HomeOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
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
                    label: <>
                        {commit.lfortran_commit_sha} ({commit.created}) &nbsp;
                        <Button href={commit.url} type="primary" size="small">
                            view
                        </Button>
                    </>,
                    key: commit.lfortran_commit_sha,
                    onClick: () => { router.push(`/commits/${commit.lfortran_commit_sha}`).then(() => router.reload()) }
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
