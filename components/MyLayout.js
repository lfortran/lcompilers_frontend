import { useEffect } from "react";

import MyHeader from "./MyHeader";
import MyFooter from "./MyFooter";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

function MyLayout({ children }) {

    useEffect(() => {
        let script = document.createElement("script");
        script.src = "//gc.zgo.at/count.js";
        script.async = true;
        script.setAttribute("data-goatcounter", "https://lfortran.goatcounter.com/count")
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    });

    return (
        <Layout style={{backgroundColor: "inherit"}}>
            <MyHeader></MyHeader>
            <Content style={{ padding: "10px 20px" }}>
                {children}
            </Content>
            <MyFooter></MyFooter>
        </Layout>
    );
}

export default MyLayout;
