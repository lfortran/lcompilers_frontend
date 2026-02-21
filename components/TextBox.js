import { Button, Tabs, Dropdown, Menu, Space } from "antd"; 
const { TabPane } = Tabs;
import { DownOutlined, PlayCircleOutlined,FullscreenOutlined,FullscreenExitOutlined} from "@ant-design/icons";
import { useIsMobile } from "./useIsMobile";
import React, { useState, useEffect } from 'react'; 
import preinstalled_programs from "../utils/preinstalled_programs";
import dynamic from 'next/dynamic'
const Editor = dynamic(import('./Editor'), {
  ssr: false
})

function TextBox({ disabled, sourceCode, setSourceCode, exampleName, setExampleName, activeTab, handleUserTabChange, myHeight }) {
    const isMobile = useIsMobile(); 
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Listen for fullscreen changes (Esc key, browser buttons, etc.)
    useEffect(() => {
        const handler = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    var menu_items = [];
    for (let category in preinstalled_programs) {
        var category_examples = []
        for (let example in preinstalled_programs[category]) {
            category_examples.push({
                key: example,
                label: example,
                onClick: () => {
                    setSourceCode(preinstalled_programs[category][example]);
                    setExampleName(example);
                }
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
        right: (
            <Space>
                <Button 
                    onClick={handleFullScreen} 
                    icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                >
                    {/* Now both text options only show on desktop, keeping mobile clean */}
                    {!isMobile && (isFullScreen ? " Exit Fullscreen" : " Fullscreen")}
                </Button>
                <Button 
                    disabled={disabled} 
                    onClick={() => handleUserTabChange(activeTab)}
                    icon={<PlayCircleOutlined />}
                > 
                    Run 
                </Button>
            </Space>
        ),
        left: (
            <Dropdown menu={{ items: menu_items }} trigger={["hover"]}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space style={{ marginRight: "10px" }}>
                        {!isMobile && "Examples"} <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        )
    };

    const tabItems = [
        {
            key: '1',
            label: `${exampleName}.f90`,
            children: (
                <div style={{ height: myHeight }}>
                    <Editor
                        sourceCode={sourceCode}
                        setSourceCode={setSourceCode}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="card-container" style={{height: "100%" }}>
            <Tabs 
                tabBarExtraContent={extraOperations} 
                style={{ height: "100%" }} 
                items={tabItems} 
            />
        </div>
    );
}

export default TextBox;
