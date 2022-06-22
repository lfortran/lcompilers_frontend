import { HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from "react";

// import { Col, Row } from "antd";
// function MyHeader() {
//     return (
//         <Row style={{padding: "10px 20px", backgroundColor: "grey"}}>
//             <Col span={24}>
//                 <h1 style={{margin: "0px"}}>LFortran</h1>
//             </Col>
//         </Row>
//     );
// }

const items = [
    {
        label: <><HomeOutlined/> LFortran</>,
        key: "1"
    }
]
function MyHeader() {
    const [current, setCurrent] = useState("1")
    return (
        <Menu theme='dark' selectedKeys={[current]} mode="horizontal" items={items} />
    );
}

export default MyHeader;
