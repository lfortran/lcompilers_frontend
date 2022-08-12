import { useState } from "react";
import { Radio } from "antd";
import { Segmented } from "antd";

function ResultBox({ activeTab, output, handleUserTabChange, myHeight }) {
    return (
        <div className="card-container">
            <Segmented
                block
                style={{ margin: "6px 0px 22px 0px" }}
                options={["STDOUT", "AST", "ASR", "WAT", "CPP", "PY"]}
                value={activeTab}
                onChange={(key) => handleUserTabChange(key)}
            />
            <pre style={{margin: "0px", height: myHeight, overflow: "scroll", border: "1px solid black" }}>
                <div id="outputBox" style={{ minHeight: "100%", fontSize: "0.9em", padding: "10px" }} dangerouslySetInnerHTML={{ __html: output }}>

                </div>
            </pre>
        </div>
    );
}

export default ResultBox;
