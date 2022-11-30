import { Footer } from "antd/lib/layout/layout";
import commit from "../utils/commit.json"

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
            <a href="https://lfortran.org/">LFortran</a> (<a href={"https://github.com/lfortran/lfortran/commit/" + commit.id}>{commit.id}</a>) by <a href="https://lcompilers.org/">LCompilers</a>
        </Footer>
    );
}

export default MyFooter;
