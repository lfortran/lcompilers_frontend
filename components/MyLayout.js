import MyHeader from "./MyHeader";
import MyFooter from "./MyFooter";
import { Divider, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

function MyLayout({ children }) {
    return (
        <Layout style={{backgroundColor: "inherit"}}>
            <MyHeader></MyHeader>
            <Content style={{ padding: "10px 20px" }}>
                {children}
            </Content>
            {/* <MyFooter></MyFooter> */}
        </Layout>
    );
}

export default MyLayout;
