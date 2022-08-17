import LFortranApp from "../components/LFortranApp";
import { getAllCommits } from "../utils/commit_handler";
import MyHeader from "../components/MyHeader";
import MyFooter from "../components/MyFooter";
import { Content } from "antd/lib/layout/layout";

export default function Home({ commits }) {
    if (!commits || (commits.length == 0)) {
        return "No commits found to load";
    }
    return (
        <>
            <MyHeader commits={commits}></MyHeader>
            <Content style={{ padding: "10px 20px" }}>
                <LFortranApp commit={commits[0]} />
            </Content>
            <MyFooter></MyFooter>
        </>);
}

export const getStaticProps = async (context) => {
    // const res = await fetch(`${server}/api/commits/${context.params.id}`);
    // const commit = await res.json();

    const commits = await getAllCommits();

    return {
        props: {
            commits,
        },
    };
};
