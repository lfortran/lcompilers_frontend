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

function define_imports(memory, outputBuffer, stdout_print) {
    function printNum(num) {
        outputBuffer.push(num.toString());
    }

    function printStr(startIdx, strSize) {
        var bytes = new Uint8Array(memory.buffer, startIdx, strSize);
        var string = new TextDecoder("utf8").decode(bytes);
        outputBuffer.push(string);
    }

    function flushBuffer() {
        stdout_print(outputBuffer.join(" ") + "\n");
        outputBuffer = [];
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
        },
    };

    return imports;
}

async function run_wasm(bytes, imports) {
    var res;
    try {
        res = await WebAssembly.instantiate(bytes, imports);
    }
    catch (e) {
        console.log(e);
        return 0;
    }
    const { _lcompilers_main } = res.instance.exports;
    try {
        _lcompilers_main();
    }
    catch (e) {
        console.log(e);
        return 0;
    }
    return 1;
}

async function setup_lfortran_funcs(lfortran_funcs, myPrint) {
    const compiler_funcs = await getLfortranExportedFuncs();

    lfortran_funcs.emit_ast_from_source = function (source_code) {
        try { return compiler_funcs.emit_ast_from_source(source_code); }
        catch (e) { console.log(e); myPrint("ERROR: AST could not be generated from the code"); return 0; }
    }

    lfortran_funcs.emit_asr_from_source = function (source_code) {
        try { return compiler_funcs.emit_asr_from_source(source_code); }
        catch (e) { console.log(e); myPrint("ERROR: ASR could not be generated from the code"); return 0; }
    }
        ;
    lfortran_funcs.emit_wat_from_source = function (source_code) {
        try { return compiler_funcs.emit_wat_from_source(source_code); }
        catch (e) { console.log(e); myPrint("ERROR: WAT could not be generated from the code"); return 0; }
    }

    lfortran_funcs.emit_cpp_from_source = function (source_code) {
        try { return compiler_funcs.emit_cpp_from_source(source_code); }
        catch (e) { console.log(e); myPrint("ERROR: CPP could not be generated from the code"); return 0; }
    }

    lfortran_funcs.emit_py_from_source = function (source_code) {
        try { return compiler_funcs.emit_py_from_source(source_code); }
        catch (e) { console.log(e); myPrint("ERROR: LLVM could not be generated from the code"); return 0; }
    }

    lfortran_funcs.compile_code = function (source_code) {
        try {
            return compiler_funcs.emit_wasm_from_source(source_code);
        }
        catch (e) {
            console.log(e);
            myPrint("ERROR: The code could not be compiled. Either there is a compile-time error or there is an issue at our end.")
            return 0;
        }

    };

    lfortran_funcs.execute_code = async function (bytes, stdout_print) {
        var outputBuffer = [];
        var memory = new WebAssembly.Memory({ initial: 10, maximum: 100 }); // initial 640Kb and max 6.4Mb
        var imports = define_imports(memory, outputBuffer, stdout_print);

        const exec_status = await run_wasm(bytes, imports);
        if (exec_status) {
            return 1;
        }
        myPrint("ERROR: The code could not be executed. Either there is a runtime error or there is an issue at our end.");
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
