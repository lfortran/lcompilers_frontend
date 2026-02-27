import { Button, Tabs, Dropdown, Menu, Space, Tooltip, message } from "antd"; 
const { TabPane } = Tabs;
import { 
    DownOutlined, 
    PlayCircleOutlined, 
    FullscreenOutlined, 
    FullscreenExitOutlined, 
    ShareAltOutlined 
} from "@ant-design/icons"; // Combined all icons here

import { useIsMobile } from "./useIsMobile";
import React, { useState, useEffect } from 'react'; 
import preinstalled_programs from "../utils/preinstalled_programs";
import { encodeSnippet } from "../utils/snippet"; 
import dynamic from 'next/dynamic'

const Editor = dynamic(import('./Editor'), {
  ssr: false
})

function TextBox({ disabled, sourceCode, setSourceCode, exampleName, setExampleName, activeTab, handleUserTabChange, myHeight,sourceUrl,setSourceUrl }) {
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
    const handleShare = () => {
        // Step 1: Guard against sharing local/manual code without an external source
        if (!sourceUrl) {
            message.warning("Only code loaded from an external source (Gist/Snippet) can be shared.");
            return;
        }

        // Step 2: Debug log before encoding to ensure the source URL is correct
        console.log("[Share] Encoding:", sourceUrl); 

        // Step 3: Encode the full raw URL and build a clean base link
        const hash = encodeSnippet(sourceUrl);
        const shareLink = `${window.location.origin}?snippet=${hash}`;

        // Step 4: Write to clipboard with success/error feedback
        navigator.clipboard.writeText(shareLink)
            .then(() => {
                message.success("Shareable link copied to clipboard!");
            })
            .catch((err) => {
                console.error("[Share] Clipboard Error:", err);
                message.error("Failed to copy link.");
            });
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
                    if (setSourceUrl) setSourceUrl(""); // Clear the external URL
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
                {/* Tooltip provides UX context for why the button might be disabled */}
                <Tooltip title={sourceUrl ? "Share this snippet" : "Load an external source to enable sharing"}>
                    <Button 
                        icon={<ShareAltOutlined />} 
                        onClick={handleShare}
                        disabled={!sourceUrl} // Ensures sharing only works for external sources
                    >
                        {!isMobile && "Share"}
                    </Button>
                </Tooltip>

                <Button 
                    onClick={handleFullScreen} 
                    icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                >
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
