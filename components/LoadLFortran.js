import Script from "next/script";
import { useCallback } from "react";
import { myServer } from "../config";

// lfortran exported functions
function getLfortranExportedFuncs() {
    return new Promise((resolve, reject) => {
        Module.onRuntimeInitialized = function () {
            resolve({
                emit_ast_from_source: Module.cwrap(
                    "emit_ast_from_source",
                    "string",
                    ["string"]
                ),
                emit_asr_from_source: Module.cwrap(
                    "emit_asr_from_source",
                    "string",
                    ["string"]
                ),
                emit_wat_from_source: Module.cwrap(
                    "emit_wat_from_source",
                    "string",
                    ["string"]
                ),
                emit_cpp_from_source: Module.cwrap(
                    "emit_cpp_from_source",
                    "string",
                    ["string"]
                ),
                emit_py_from_source: Module.cwrap(
                    "emit_wat_from_source",
                    "string",
                    ["string"]
                ),
                emit_wasm_from_source: Module.cwrap(
                    "emit_wasm_from_source",
                    "string",
                    ["string"]
                ),
            });
        };
    });
}

function define_imports(memory, outputBuffer, exit_code, stdout_print) {
    const printNum = (num) => outputBuffer.push(num.toString());
    const printStr = (startIdx, strSize) => outputBuffer.push(
        new TextDecoder("utf8").decode(new Uint8Array(memory.buffer, startIdx, strSize)));
    const flushBuffer = () => {
        stdout_print(outputBuffer.join(" ") + "\n");
        outputBuffer.length = 0;
    }
    const set_exit_code = (exit_code_val) => exit_code.val = exit_code_val;
    const show_image = (rows, cols, arr) => {
        // console.log(rows, cols, arr)
        var arr2D_data = new DataView(memory.buffer, arr, Int32Array.BYTES_PER_ELEMENT * rows * cols);
        var arr2D = new Int32Array(rows * cols);
        for (let k = 0; k < rows * cols; k++) {
            arr2D[k] = arr2D_data.getInt32(k << 2, true);
        }
        // var imgText = "";
        // for (let i = 0; i < rows; i++) {
        //     for (let j = 0; j < cols; j++) {

        //         imgText += ["0", "1"][arr2D.getInt32((i * cols + j) * 4, true)];
        //     }
        //     imgText += "\n";
        // }
        // console.log(imgText);
        var canvas = document.createElement("CANVAS");
        canvas.width = cols;
        canvas.height = rows;
        var ctx = canvas.getContext("2d");
        var imgData = ctx.createImageData(cols, rows);
        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i + 0] = arr2D[i >> 2];
            imgData.data[i + 1] = arr2D[i >> 2];
            imgData.data[i + 2] = arr2D[i >> 2];
            imgData.data[i + 3] = 255; // alpha channel (from 0-255), 0 is transparent and 255 is fully visible
        }
        ctx.putImageData(imgData, 0, 0);
        outputBuffer.push(`<img alt="constructed image" src="${canvas.toDataURL('image/jpeg')}" height="${rows}" width="${cols}" style="aspect-ratio: 1 / 1;"/>`)
        flushBuffer();
    }
    var imports = {
        js: {
            memory: memory,
            /* functions */
            print_i32: printNum,
            print_i64: printNum,
            print_f32: printNum,
            print_f64: printNum,
            print_str: printStr,
            flush_buf: flushBuffer,
            set_exit_code: set_exit_code,
            show_img: show_image
        },
    };
    return imports;
}

async function run_wasm(bytes, imports) {
    try {
        var res = await WebAssembly.instantiate(bytes, imports);
        const { _lcompilers_main } = res.instance.exports;
        _lcompilers_main();
    } catch(e) { return e; }
    return "Success"
}

async function setup_lfortran_funcs(lfortran_funcs, myPrint) {
    const compiler_funcs = await getLfortranExportedFuncs();

    lfortran_funcs.emit_ast_from_source = function (source_code) {
        try { return compiler_funcs.emit_ast_from_source(source_code); }
        catch (e) { console.log(e); myPrint(e + "\nERROR: AST could not be generated from the code"); return 0; }
    }

    lfortran_funcs.emit_asr_from_source = function (source_code) {
        try { return compiler_funcs.emit_asr_from_source(source_code); }
        catch (e) { console.log(e); myPrint(e + "\nERROR: ASR could not be generated from the code"); return 0; }
    }
        ;
    lfortran_funcs.emit_wat_from_source = function (source_code) {
        try { return compiler_funcs.emit_wat_from_source(source_code); }
        catch (e) { console.log(e); myPrint(e + "\nERROR: WAT could not be generated from the code"); return 0; }
    }

    lfortran_funcs.emit_cpp_from_source = function (source_code) {
        try { return compiler_funcs.emit_cpp_from_source(source_code); }
        catch (e) { console.log(e); myPrint(e + "\nERROR: CPP could not be generated from the code"); return 0; }
    }

    lfortran_funcs.emit_py_from_source = function (source_code) {
        try { return compiler_funcs.emit_py_from_source(source_code); }
        catch (e) { console.log(e); myPrint(e + "\nERROR: LLVM could not be generated from the code"); return 0; }
    }

    lfortran_funcs.compile_code = function (source_code) {
        try {
            return compiler_funcs.emit_wasm_from_source(source_code);
        }
        catch (e) {
            console.log(e);
            myPrint(e + "\nERROR: The code could not be compiled. Either there is a compile-time error or there is an issue at our end.")
            return 0;
        }

    };

    lfortran_funcs.execute_code = async function (bytes, stdout_print) {
        var exit_code = {val: 1}; /* non-zero exit code */
        var outputBuffer = [];
        var memory = new WebAssembly.Memory({ initial: 100, maximum: 100 }); // fixed 6.4 Mb memory currently
        var imports = define_imports(memory, outputBuffer, exit_code, stdout_print);
        var err_msg = await run_wasm(bytes, imports);
        if (exit_code.val == 0) {
            return 1;
        }
        console.log(err_msg);
        myPrint(err_msg + "\nERROR: The code could not be executed. Either there is a runtime error or there is an issue at our end.");
        return 0;
    };
}

function LoadLFortran({
    moduleReady,
    setModuleReady,
    lfortran_funcs,
    openNotification,
    myPrint,
    handleUserTabChange
}) {
    const setupLFortran = useCallback(async () => {
        await setup_lfortran_funcs(lfortran_funcs, myPrint);
        setModuleReady(true);
        openNotification("LFortran Module Initialized!", "bottomRight");
        console.log("LFortran Module Initialized!");
        handleUserTabChange("STDOUT");
    }, [moduleReady]); // update the callback if the state changes

    return (
        <div>
            <Script src={`${myServer}/lfortran.js`} onLoad={setupLFortran}></Script>
        </div>
    );
}

export default LoadLFortran;
