// import { useEffect, useRef, useState } from "react";
import { Button, Tabs, Spin } from "antd";
import Editor from 'react-simple-code-editor';
const { TabPane } = Tabs;
import { PlayCircleOutlined } from "@ant-design/icons";

function TextBox({ disabled, sourceCode, setSourceCode, activeTab, handleUserTabChange, myHeight }) {
    // const ref = useRef(null);
    // useEffect(() => {
    //     console.log("Hi")
    //     console.log(ref.current.parentElement.offsetHeight)
    // }, [])

    const extraOperations = (
        <Button disabled={disabled} onClick={() => handleUserTabChange(activeTab)}>
            <PlayCircleOutlined /> Run
        </Button>
    );

    return (
        <div className="card-container" style={{height: "100%" }}>
            <Tabs tabBarExtraContent={extraOperations} style={{ height: "100%" }}>
                <TabPane tab="main.f90" key="1" style={{ height: myHeight, overflow: "scroll" }}>
                    <Editor
                        value={sourceCode}
                        onValueChange={code => setSourceCode(code)}
                        padding={10}
                        tabSize={4}
                        highlight={code => code}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                            minHeight: "100%",
                            border: "0.1px solid black"
                        }}
                    />
                </TabPane>

            </Tabs>
        </div>
    );
}

export default TextBox;
