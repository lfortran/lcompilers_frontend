import Script from "next/script";

import MyHeader from "./MyHeader";
import MyFooter from "./MyFooter";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

const GA_MEASUREMENT_ID = "G-YJKXPHBZYC";

function MyLayout({ children }) {
    return (
        <Layout style={{backgroundColor: "inherit"}}>
            { /* Google tag (gtag.js) */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_MEASUREMENT_ID}');
                `}
            </Script>

            <MyHeader></MyHeader>
            <Content style={{ padding: "10px 20px" }}>
                {children}
            </Content>
            <MyFooter></MyFooter>
        </Layout>
    );
}

export default MyLayout;
