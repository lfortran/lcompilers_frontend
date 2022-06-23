// import { Col, Row } from "antd";
// function MyFooter() {
//     return (
//         <Row
//             style={{
//                 textAlign: "center",
//                 position: "absolute",
//                 width: "100%",
//                 bottom: "0px",
//                 padding: "10px",
//                 backgroundColor: "grey"
//             }}
//         >
//             <Col span={24}><b>LFortran by LCompilers</b></Col>
//         </Row>
//     );
// }

import { Footer } from "antd/lib/layout/layout";

function MyFooter() {
    return (
        <Footer
            style={{
                backgroundColor: "#001529",
                color: "#fff",
                padding: "10px 0px",
                textAlign: "center",
                width: "100%",
            }}
        >
            <a href="https://lfortran.org/">LFortran</a> by <a href="https://lcompilers.org/">LCompilers</a>
        </Footer>
    );
}

export default MyFooter;
