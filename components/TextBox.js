import { Button, Tabs, Spin } from "antd";
import Editor from 'react-simple-code-editor';
const { TabPane } = Tabs;
import { PlayCircleOutlined } from "@ant-design/icons";

function TextBox({ disabled, sourceCode, setSourceCode, activeTab, handleUserTabChange }) {
    const extraOperations = (
        <Button disabled={disabled} onClick={() => handleUserTabChange(activeTab)}>
            <PlayCircleOutlined /> Run
        </Button>
    );
    return (
        <div className="card-container" style={{ padding: "0px 20px" }}>
            <Tabs tabBarExtraContent={extraOperations}>
                <TabPane tab="main.f90" key="1">
                    <Editor
                        value={sourceCode}
                        onValueChange={code => setSourceCode(code)}
                        padding={10}
                        tabSize={4}
                        highlight={code => code}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                            border: "0.5px solid black"
                        }}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default TextBox;
