import Head from "next/head";

function HeadMeta() {
    return (
        <Head>
            <title>LFortran</title>
            <meta
                name="description"
                content="This is LFortran Compiler"
            />
            <link rel="icon" href="/favicon.ico" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta charSet="UTF-8"></meta>
        </Head>
    );
}

export default HeadMeta;
