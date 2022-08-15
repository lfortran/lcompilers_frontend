import TextBox from "../components/TextBox";
import ResultBox from "../components/ResultBox";
import LoadLFortran from "../components/LoadLFortran";
import remove_ansi_escape_seq from "../utils/ast_asr_handler";

import { useState } from "react";
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

var src_code_mandel_brot = `program mandelbrot
    implicit none
    integer  , parameter :: rk       = 8
    integer  , parameter :: i_max    =  600
    integer  , parameter :: j_max    =  450
    integer  , parameter :: n_max    =  100
    real (rk), parameter :: x_centre = -0.5_rk
    real (rk), parameter :: y_centre =  0.0_rk
    real (rk), parameter :: width    =  4.0_rk
    real (rk), parameter :: height   =  3.0_rk
    real (rk), parameter :: dx_di    =   width / i_max
    real (rk), parameter :: dy_dj    = -height / j_max
    real (rk), parameter :: x_offset = x_centre - 0.5_rk * (i_max + 1) * dx_di
    real (rk), parameter :: y_offset = y_centre - 0.5_rk * (j_max + 1) * dy_dj
    integer :: image(j_max, i_max)
    integer   :: i
    integer   :: j
    integer   :: n
    real (rk) :: x
    real (rk) :: y
    real (rk) :: x_0
    real (rk) :: y_0
    real (rk) :: x_sqr
    real (rk) :: y_sqr

    do j = 1, j_max
        y_0 = y_offset + dy_dj * j
        do i = 1, i_max
            x_0 = x_offset + dx_di * i
            x = 0.0_rk
            y = 0.0_rk
            n = 0
            do
            x_sqr = x ** 2
            y_sqr = y ** 2
            if (x_sqr + y_sqr > 4.0_rk) then
                image(j,i) = 255
                exit
            end if
            if (n == n_max) then
                image(j,i) = 0
                exit
            end if
            y = y_0 + 2.0_rk * x * y
            x = x_0 + x_sqr - y_sqr
            n = n + 1
            end do
        end do
    end do

    print *, "The Mandelbrot image is:"
    call show_img(j_max, i_max, image)

    print *, "Thank you! Hope you had fun!"

    interface
        subroutine show_img(n, m, A) bind(c)
        integer, intent(in) :: n, m
        integer, intent(in) :: A(n,m)
        end subroutine
    end interface
end program mandelbrot
`;

export default function Home() {
    const [moduleReady, setModuleReady] = useState(false);
    const [sourceCode, setSourceCode] = useState(src_code_mandel_brot);
    const [activeTab, setActiveTab] = useState("STDOUT");
    const [output, setOutput] = useState("");
    const [myHeight, setMyHeight] = useState("calc(100vh - 170px)")

    async function handleUserTabChange(key) {
        if (key == "STDOUT") {
            if(sourceCode.trim() === ""){
                setOutput("No Source Code to compile");
                setActiveTab(key);
                return;
            }
            const wasm_bytes_response = lfortran_funcs.compile_code(sourceCode);
            if (wasm_bytes_response) {
                const [exit_code, ...compile_result] = wasm_bytes_response.split(",");
                if (exit_code !== "0") {
                    setOutput(ansi_up.ansi_to_html(compile_result)); // print compile-time error found by lfortran to output
                }
                else {
                    var stdout = [];
                    const exec_res = await lfortran_funcs.execute_code(
                        new Uint8Array(compile_result),
                        (text) => stdout.push(text)
                    );
                    if (exec_res) {
                        setOutput(stdout.join(""));
                    }
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
                        ></ResultBox>
                    ) : (
                        <Spin
                            style={{
                                position: "relative",
                                top: "50%",
                                left: "50%",
                            }}
                            indicator={antIcon}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
}
