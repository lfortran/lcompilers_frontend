import TextBox from "../components/TextBox";
import ResultBox from "../components/ResultBox";
import LoadLFortran from "../components/LoadLFortran";
import preinstalled_programs from "../utils/preinstalled_programs";
import { useIsMobile } from "../components/useIsMobile";

import { useState, useEffect, useRef } from "react";
import { Col, Row, Spin, notification } from "antd"; // Combined into one line
import { LoadingOutlined, ShareAltOutlined } from "@ant-design/icons"; // Added Share icon
import AnsiUp from "ansi_up";

// ONLY add this for Issue #23
import { decodeSnippet } from "../utils/snippet";

var ansi_up = new AnsiUp();

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

const openNotification = (msg, placement) => {
    notification.info({
        message: msg,
        placement,
    });
};

var lfortran_funcs = {
    emit_ast_from_source: null,
    emit_asr_from_source: null,
    emit_wat_from_source: null,
    emit_wasm_from_source: null,
    emit_cpp_from_source: null,
    emit_py_from_source: null,
    compile_code: null,
    execute_code: null,
};

export default function Home() {
    const [moduleReady, setModuleReady] = useState(false);
    const [sourceCode, setSourceCode] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");
    const [exampleName, setExampleName] = useState("main");
    const [activeTab, setActiveTab] = useState("STDOUT");
    const [output, setOutput] = useState("");
    const [dataFetch, setDataFetch] = useState(false);
    const isMobile = useIsMobile();
    const initialized = useRef(false);
    const myHeight = ((!isMobile) ? "calc(100vh - 170px)" : "calc(50vh - 85px)");

    // Consolidated Effect: Handles mounting logic exactly once
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            setSourceCode(""); // Clear initial state
            fetchData(); // Trigger the fetch
        }
    }, []);

    // Handles the automatic run/tab change once data is ready
    useEffect(() => {
        if(moduleReady && dataFetch) {
            handleUserTabChange("STDOUT");
        }
    }, [moduleReady, dataFetch]);

    async function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        let downloadUrl = "";

        // Case 1: Shared Snippet (Issue #23)
        if (urlParams.get("snippet")) {
            downloadUrl = decodeSnippet(urlParams.get("snippet"));
        } 
        // Case 2: Direct URL Parameter (Direct Raw Link)
        else if (urlParams.get("url")) {
            downloadUrl = urlParams.get("url");
        }
        // Case 4: Direct Code
        else if (urlParams.get("code")) {
            setSourceCode(decodeURIComponent(urlParams.get("code")));
            setSourceUrl(""); 
            setDataFetch(true);
            return;
        }

        // Execution: Fetch only if a downloadUrl was successfully determined
        if (downloadUrl) {
            fetch(downloadUrl, { cache: "no-store" })
                .then((response) => {
                    if (!response.ok) throw new Error("Fetch failed");
                    return response.text();
                })
                .then((data) => {
                    setSourceCode(data);
                    setSourceUrl(downloadUrl); // Enable Share button
                    setDataFetch(true);
                    openNotification("Source Code loaded successfully.", "bottomRight");
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    // Only one notification will now appear due to the Ref guard
                    openNotification("Error: Please provide a direct download link.", "bottomRight");
                    setSourceCode(preinstalled_programs.basic.mandelbrot);
                    setSourceUrl(""); 
                    setDataFetch(true);
                });
        } 
        else {
            // Default behavior if no valid download parameters are present
            setSourceCode(preinstalled_programs.basic.mandelbrot);
            setSourceUrl(""); 
            setDataFetch(true);
            
            // Only notify for invalid/unsupported parameters if the URL isn't empty
            const hasParams = urlParams.keys().next().done === false;
            if (hasParams && !urlParams.get("code") && !urlParams.get("gist") && !urlParams.get("url") && !urlParams.get("snippet")) {
                openNotification("The URL contains an invalid parameter.", "bottomRight");
            }
        }
    }
    async function handleUserTabChange(key) {
        if (key == "STDOUT") {
            if(sourceCode.trim() === ""){
                setOutput("No Source Code to compile");
                setActiveTab(key);
                return;
            }
            const start_compile = performance.now();
            const wasm_bytes_response = lfortran_funcs.compile_code(sourceCode);
            const end_compile = performance.now();
            const duration_compile = end_compile - start_compile;
            sessionStorage.setItem("duration_compile", duration_compile);
            if (wasm_bytes_response) {
                const [exit_code, ...compile_result] = wasm_bytes_response.split(",");
                if (exit_code !== "0") {
                     // print compile-time error found by lfortran to output
                    setOutput(ansi_up.ansi_to_html(compile_result) + `\nCompilation Time: ${duration_compile} ms`);
                }
                else {
                    var stdout = [];
                    const exec_res = await lfortran_funcs.execute_code(
                        new Uint8Array(compile_result),
                        (text) => stdout.push(text)
                    );
                    setOutput(stdout.join(""));
                }
            }
        } else if (key == "AST") {
            const res = lfortran_funcs.emit_ast_from_source(sourceCode);
            if (res) {
                setOutput(ansi_up.ansi_to_html(res));
            }
        } else if (key == "ASR") {
            const res = lfortran_funcs.emit_asr_from_source(sourceCode);
            if (res) {
                setOutput(ansi_up.ansi_to_html(res));
            }
        } else if (key == "WAT") {
            const res = lfortran_funcs.emit_wat_from_source(sourceCode);
            if (res) {
                setOutput(ansi_up.ansi_to_html(res));
            }
        } else if (key == "CPP") {
            const res = lfortran_funcs.emit_cpp_from_source(sourceCode);
            if (res) {
                setOutput(ansi_up.ansi_to_html(res));
            }
        } else if (key == "PY") {
            setOutput("Support for PY is not yet enabled");
        } else {
            setOutput("Unknown key: " + key);
        }
        setActiveTab(key);
    }

    return (
        <>
            <LoadLFortran
                moduleReady={moduleReady}
                setModuleReady={setModuleReady}
                lfortran_funcs={lfortran_funcs}
                openNotification={openNotification}
                myPrint={setOutput}
            ></LoadLFortran>

            <Row gutter={[16, 16]}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                    <TextBox
                        disabled={!moduleReady}
                        sourceCode={sourceCode}
                        setSourceCode={setSourceCode}
                        sourceUrl={sourceUrl} // New prop for sharing
                        setSourceUrl={setSourceUrl} // Allow clearing if code changes manually
                        exampleName={exampleName}
                        setExampleName={setExampleName}
                        activeTab={activeTab}
                        handleUserTabChange={handleUserTabChange}
                        myHeight={myHeight}
                    ></TextBox>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                    {moduleReady ? (
                        <ResultBox
                            activeTab={activeTab}
                            output={output}
                            handleUserTabChange={handleUserTabChange}
                            myHeight={myHeight}
                            openNotification={openNotification}
                        ></ResultBox>
                    ) : (
                        <div style={{height: myHeight}}>
                            <Spin
                                style={{
                                    position: "relative",
                                    top: "50%",
                                    left: "50%",
                                }}
                                indicator={antIcon}
                            />
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
}
