function remove_ansi_escape_seq(text) {
    return text.replace(/(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]/g, "");
}

export default remove_ansi_escape_seq;
