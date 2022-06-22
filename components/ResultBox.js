import { useState } from "react";
import { Radio } from "antd";
import { Segmented } from "antd";

function ResultBox({ activeTab, output, handleUserTabChange }) {
    return (
        <div className="card-container">
            <Segmented
                block
                style={{ margin: "6px 0px 22px 0px" }}
                options={["STDOUT", "AST", "ASR", "WAT", "CPP", "PY"]}
                value={activeTab}
                onChange={(key) => handleUserTabChange(key)}
            />
            <pre>
                <div id="outputBox" style={{ height: "450px", border: "1px solid black", overflow: "scroll", fontSize: "0.8em", padding: "10px" }} dangerouslySetInnerHTML={{ __html: output }}>

                </div>
            </pre>
        </div>
    );
}

export default ResultBox;
