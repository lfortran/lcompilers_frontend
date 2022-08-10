import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-fortran";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function Editor({sourceCode, setSourceCode}) {
    return (
        <AceEditor
            mode="fortran"
            theme="monokai"
            onChange={(code)=>setSourceCode(code)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={sourceCode}
            width="100%"
            height="100%"
            showPrintMargin={false}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                // minHeight: "100%",
                // border: "0.1px solid black"
            }}
        />
    )
}

export default Editor;
