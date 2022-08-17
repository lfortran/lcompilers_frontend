import { Button, Tabs } from "antd";
const { TabPane } = Tabs;
import { PlayCircleOutlined } from "@ant-design/icons";
import dynamic from 'next/dynamic'
const Editor = dynamic(import('./Editor'), {
  ssr: false
})

function TextBox({ disabled, sourceCode, setSourceCode, activeTab, handleUserTabChange, myHeight }) {
    const extraOperations = (
        <Button disabled={disabled} onClick={() => handleUserTabChange(activeTab)}>
            <PlayCircleOutlined /> Run
        </Button>
    );

    return (
        <div className="card-container" style={{height: "100%" }}>
            <Tabs tabBarExtraContent={extraOperations} style={{ height: "100%" }}>
                <TabPane tab="main.f90" key="1" style={{ height: myHeight }}>
                    <Editor
                        sourceCode={sourceCode}
                        setSourceCode={setSourceCode}
                    />
                </TabPane>

            </Tabs>
        </div>
    );
}

export default TextBox;
