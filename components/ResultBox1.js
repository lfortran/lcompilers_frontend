import { useState } from "react";
import { Button, Tabs } from "antd";
const { TabPane } = Tabs;
import AnsiUp from "ansi_up";
import remove_ansi_escape_seq from "../utils/ast_asr_handler";

var ansi_up = new AnsiUp();

function ResultBox1({ disabled, sourceCode, lfortran_funcs }) {
    const [activeKey, setActiveKey] = useState("0");
    const [stdoutVal, setStdoutVal] = useState("Stdout");

    const exec_code = async function () {
        setActiveKey("1");
        if (!sourceCode) {
            setStdoutVal("No Source Code");
            return;
        }

        var output = "";
        function print(text) {
            output += text;
        }

        await lfortran_funcs.execute_code(
            new Uint8Array(lfortran_funcs.compile_code(sourceCode)),
            print
        );

        setStdoutVal(output);
    };

    return (
        <div className="card-container" style={{ padding: "0px 20px" }}>
            <Tabs
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key)}
                disabled={disabled}
                tabBarExtraContent={
                    <Button onClick={exec_code}>Execute</Button>
                }
            >
                <TabPane tab="Stdout" key="1">
                    <pre>{stdoutVal}</pre>
                </TabPane>
                <TabPane tab="AST" key="2">
                    {activeKey === "2" && sourceCode
                        ? remove_ansi_escape_seq(
                              lfortran_funcs.emit_ast_from_source(sourceCode)
                          )
                        : "No Source Code"}
                </TabPane>
                <TabPane tab="ASR" key="3">
                    {activeKey === "3" && sourceCode
                        ? remove_ansi_escape_seq(
                              lfortran_funcs.emit_asr_from_source(sourceCode)
                          )
                        : "No Source Code"}
                </TabPane>
                <TabPane tab="WAT" key="4">
                    {activeKey === "4" && sourceCode
                        ? lfortran_funcs.emit_wat_from_source(sourceCode)
                        : "No Source Code"}
                </TabPane>
                {/* <TabPane tab="LLVM" key="5">
                    Tab 5
                </TabPane>
                <TabPane tab="CPP" key="6">
                    Tab 6
                </TabPane>
                <TabPane tab="PY" key="">
                    Tab 7
                </TabPane> */}
            </Tabs>
        </div>
    );
}

export default ResultBox1;
