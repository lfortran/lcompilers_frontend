import React, { useState } from 'react';
import { useIsMobile } from "./useIsMobile";
import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { Segmented } from "antd";

//  onNodeClick to props
function ResultBox({ activeTab, output, handleUserTabChange, myHeight, openNotification, onNodeClick }) {
    const isMobile = useIsMobile();
    const [showCopy, setShowCopy] = useState(false);

    const handleOutputClick = (e) => {
        //  .closest to handle nested spans
        const target = e.target.closest("[data-start-line]");
        
        if (target) {
            const rangeData = {
                startLine: parseInt(target.getAttribute("data-start-line")),
                startCol: parseInt(target.getAttribute("data-start-col")),
                endLine: parseInt(target.getAttribute("data-end-line")),
                endCol: parseInt(target.getAttribute("data-end-col"))
            };

            if (onNodeClick) {
                onNodeClick(rangeData);
            } 
        } 
    };

    function copyTextToClipboard(e) {
        e.stopPropagation(); 
        const parser = new DOMParser();
        const doc = parser.parseFromString(output, 'text/html');
        navigator.clipboard.writeText(doc.documentElement.textContent);
        openNotification(`${activeTab} output copied`, "bottomRight");
        setShowCopy(false);
    }

    return (
        <div 
            className="card-container" 
            onClick={() => isMobile && setShowCopy(!showCopy)} 
        >
            <Segmented
                block
                style={{ margin: "6px 0px 22px 0px" }}
                options={["STDOUT", "AST", "ASR", "WAT", "CPP", "PY"]}
                value={activeTab}
                onChange={(key) => handleUserTabChange(key)}
            />
            <Button 
                onClick={copyTextToClipboard}  
                style={{ 
                    position: "absolute", 
                    right: "40px", 
                    top: "80px",
                    opacity: !isMobile || showCopy ? 1 : 0, 
                    pointerEvents: !isMobile || showCopy ? "auto" : "none",
                    transition: "opacity 0.2s ease-in-out",
                    zIndex: 10 // Ensure copy button stays above clickable spans
                }}
            >
                <CopyOutlined />
            </Button>
            <pre style={{ margin: "0px", height: myHeight, overflow: "scroll", border: "1px solid black" }}>
                <div 
                    id="outputBox" 
                    //  Attach the click listener to the container
                    onClick={handleOutputClick}
                    style={{ minHeight: "100%", fontSize: "0.9em", padding: "10px" }} 
                    dangerouslySetInnerHTML={{ __html: output }}
                >
                </div>
            </pre>
        </div>
    );
}
export default ResultBox;