import "../styles/globals.css";

import MyLayout from "../components/MyLayout";

function MyApp({ Component, pageProps }) {
    return (
        <MyLayout>
            <Component {...pageProps} />
        </MyLayout>
    );
}

export default MyApp;
