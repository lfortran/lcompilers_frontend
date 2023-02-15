import { Button, Tabs, Dropdown, Menu, Space } from "antd";
const { TabPane } = Tabs;
import { DownOutlined, PlayCircleOutlined } from "@ant-design/icons";
import preinstalled_programs from "../utils/preinstalled_programs";
import dynamic from 'next/dynamic'
const Editor = dynamic(import('./Editor'), {
  ssr: false
})

function TextBox({ disabled, sourceCode, setSourceCode, activeTab, handleUserTabChange, myHeight }) {
    var menu_items = [];
    for (let category in preinstalled_programs) {
        var category_examples = []
        for (let example in preinstalled_programs[category]) {
            category_examples.push({
                key: example,
                label: example,
                onClick: () => { setSourceCode(preinstalled_programs[category][example]) }
            });
        }

        menu_items.push({
            key: category,
            label: category,
            children: category_examples
        });
    }

    const examples_menu = (<Menu items={menu_items}></Menu>);
    const extraOperations = {
        right: <Button disabled={disabled} onClick={() => handleUserTabChange(activeTab)}> <PlayCircleOutlined /> Run </Button>,
        left: <Dropdown overlay={examples_menu} trigger="hover">
                <a onClick={(e) => e.preventDefault()}>
                    <Space style={{marginRight: "10px"}}>
                        Examples <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
    };

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
