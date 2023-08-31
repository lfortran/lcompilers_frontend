import TextBox from "../components/TextBox";
import ResultBox from "../components/ResultBox";
import LoadLFortran from "../components/LoadLFortran";
import preinstalled_programs from "../utils/preinstalled_programs";
import { useIsMobile } from "../components/useIsMobile";

import { useState, useEffect } from "react";
import { Col, Row, Spin } from "antd";
import { notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AnsiUp from "ansi_up";

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
    const [sourceCode, setSourceCode] = useState(preinstalled_programs.basic.mandelbrot);
    const [exampleName, setExampleName] = useState("mandelbrot");
    const [activeTab, setActiveTab] = useState("STDOUT");
    const [output, setOutput] = useState("");
    const isMobile = useIsMobile();

    const myHeight = ((!isMobile) ? "calc(100vh - 170px)" : "calc(50vh - 85px)");

    useEffect(() => {
           fetchData();
      }, []);

      useEffect(() => {
            if(moduleReady){handleUserTabChange("STDOUT"); }
    }, [moduleReady]);

    async function fetchData() {
        const url = window.location.search;
        const gist = "https://gist.githubusercontent.com/";
        const urlParams = new URLSearchParams(url);

        if (urlParams.get("code")) {
            setSourceCode(decodeURIComponent(urlParams.get("code")));
        } else if (urlParams.get("gist")) {
            const gistUrl = gist + urlParams.get("gist") + "/raw/";
            fetch(gistUrl)
                .then((response) => response.text())
                .then((data) => {
                setSourceCode(data);
                openNotification(
                    "Source Code loaded from gist.",
                    "bottomRight"
                );

                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    openNotification("error fetching .", "bottomRight");
                });
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
            // const res = lfortran_funcs.emit_py_from_source(sourceCode);
            // if (res) {
            //     setOutput(ansi_up.ansi_to_html(res));
            // }
        } else {
            console.log("Unknown key:", key);
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
                handleUserTabChange={handleUserTabChange}
            ></LoadLFortran>

            <Row gutter={[16, 16]}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                    <TextBox
                        disabled={!moduleReady}
                        sourceCode={sourceCode}
                        setSourceCode={setSourceCode}
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
