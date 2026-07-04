import React, { useRef, useEffect } from "react";
import AceEditor from "react-ace";

// Import Ace modes and themes
import "ace-builds/src-noconflict/mode-fortran";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const Editor = ({ sourceCode, setSourceCode, editorRef }) => {
    const aceEditorRef = useRef(null);

    useEffect(() => {
        if (editorRef) {
            editorRef.current = {
                jumpToRange(rangeData) {
                    if (aceEditorRef.current) {
                        const editor = aceEditorRef.current.editor;
                        const ace = window.ace;

                        if (ace) {
                            // Required for the selection to not be a solid block
                            editor.setSelectionStyle("text"); 

                            const Range = ace.require("ace/range").Range;
                            
                            // Convert 1-based metadata to 0-based Ace indexing
                            const startRow = rangeData.startLine - 1;
                            const startCol = rangeData.startCol - 1;
                            const endRow = rangeData.endLine - 1;
                            const endCol = rangeData.endCol - 1;

                            // Clear existing selection to avoid visual ghosting
                            editor.selection.clearSelection();

                            // Apply the precise syntactic range
                            const newRange = new Range(startRow, startCol, endRow, endCol);
                            editor.selection.setRange(newRange);

                            // Navigation and Focus
                            editor.scrollToLine(rangeData.startLine, true, true);
                            editor.focus();
                            editor.renderer.scrollSelectionIntoView(newRange); 
                        }
                    }
                }
            };
        }
    }, [editorRef]);

    return (
        <AceEditor
            ref={aceEditorRef}
            mode="fortran"
            theme="monokai"
            onChange={(code) => setSourceCode(code)}
            name="LFORTRAN_EDITOR"
            editorProps={{ $blockScrolling: true }}
            value={sourceCode}
            width="100%"
            height="100%"
            showPrintMargin={false}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
            }}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
            }}
        />
    );
};


export default Editor;