import Script from "next/script";
import { useCallback } from "react";

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

var memory;
function define_imports(outputBuffer, exit_code, stdout_print) {
    const flushBuffer = () => {
        stdout_print(outputBuffer.join(""));
        outputBuffer.length = 0;
    }
    const fd_write = (file_type, iov_location, no_of_iovs, return_val_mem_loc) => {
        const mem_data = new DataView(memory.buffer, iov_location, Int32Array.BYTES_PER_ELEMENT * 2);
        const strLoc = mem_data.getInt32(0, true);
        const strLen = mem_data.getInt32(4, true);
        const s =  new TextDecoder("utf8").decode(new Uint8Array(memory.buffer, strLoc, strLen));
        outputBuffer.push(s);
    }
    const proc_exit = (exit_code_val) => exit_code.val = exit_code_val;
    const cpu_time = (time) => (Date.now() / 1000); // Date.now() returns milliseconds, so divide by 1000
    const show_image = (cols, rows, arr) => {
        var arr2D_data = new DataView(memory.buffer, arr, Int32Array.BYTES_PER_ELEMENT * rows * cols);
        var canvas = document.createElement("CANVAS");
        canvas.width = cols;
        canvas.height = rows;
        var ctx = canvas.getContext("2d");
        var imgData = ctx.createImageData(cols, rows);
        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i + 0] = arr2D_data.getInt32(i, true);
            imgData.data[i + 1] = arr2D_data.getInt32(i, true);
            imgData.data[i + 2] = arr2D_data.getInt32(i, true);
            imgData.data[i + 3] = 255; // alpha channel (from 0-255), 0 is transparent and 255 is fully visible
        }
        ctx.putImageData(imgData, 0, 0);
        outputBuffer.push(`<img alt="constructed image" src="${canvas.toDataURL('image/jpeg')}" height="${rows}" width="${cols}" style="aspect-ratio: 1 / 1;"/>\n`)
        flushBuffer();
    }
    const show_image_color = (cols, rows, arr) => {
        var arr2D_data = new DataView(memory.buffer, arr, Int32Array.BYTES_PER_ELEMENT * 4 * rows * cols);
        var canvas = document.createElement("CANVAS");
        canvas.width = cols;
        canvas.height = rows;
        var ctx = canvas.getContext("2d");
        var imgData = ctx.createImageData(cols, rows);
        // The data in DataView is stored as i32 per channel, while it
        // should be i8. Currently we have to copy the i32 integer and assign
        // it to the canvas' i8 integer. We have to index it with 4*i, because
        // the getInt32 method accepts a byte index.
        for (var i = 0; i < imgData.data.length; i++) {
            imgData.data[i] = arr2D_data.getInt32(4*i, true);
        }
        ctx.putImageData(imgData, 0, 0);
        outputBuffer.push(`<img alt="constructed image" src="${canvas.toDataURL('image/jpeg')}" height="${rows}" width="${cols}" style="aspect-ratio: 1 / 1;"/>\n`)
        flushBuffer();
    }
    var imports = {
        wasi_snapshot_preview1: {
            /* wasi functions */
            fd_write: fd_write,
            proc_exit: proc_exit,
        },
        js: {
            /* custom functions */
            cpu_time: cpu_time,
            show_img: show_image,
            show_img_color: show_image_color
        },
    };
    return imports;
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
        var imports = define_imports(outputBuffer, exit_code, stdout_print);
        try {
            var res = await WebAssembly.instantiate(bytes, imports);
            memory = res.instance.exports.memory;
            res.instance.exports._start();
            stdout_print(outputBuffer.join(""));
        } catch(err_msg) {
            stdout_print(outputBuffer.join(""));
            if (exit_code.val == 0) {
                return;
            }
            console.log(err_msg);
            stdout_print(`\n${err_msg}\nERROR: The code could not be executed. Either there is a runtime error or there is an issue at our end.`);
        }
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
            <Script src={`./lfortran.js`} onLoad={setupLFortran}></Script>
        </div>
    );
}

export default LoadLFortran;
