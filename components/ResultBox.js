import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { Segmented } from "antd";

function ResultBox({ activeTab, output, handleUserTabChange, myHeight }) {
    function copyTextToClipboard() {
        const parser = new DOMParser();
        const doc = parser.parseFromString(output, 'text/html');
        navigator.clipboard.writeText(doc.documentElement.textContent);
    }
    return (
        <div className="card-container">
            <Segmented
                block
                style={{ margin: "6px 0px 22px 0px" }}
                options={["STDOUT", "AST", "ASR", "WAT", "CPP", "PY"]}
                value={activeTab}
                onChange={(key) => handleUserTabChange(key)}
            />
            <Button onClick={copyTextToClipboard}  style={{ position: "absolute", right: "40px", top: "80px" }}>
                <CopyOutlined />
            </Button>
            <pre style={{margin: "0px", height: myHeight, overflow: "scroll", border: "1px solid black" }}>
                <div id="outputBox" style={{ minHeight: "100%", fontSize: "0.9em", padding: "10px" }} dangerouslySetInnerHTML={{ __html: output }}>

                </div>
            </pre>
        </div>
    );
}

export default ResultBox;
