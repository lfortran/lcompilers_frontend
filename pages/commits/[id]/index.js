import LFortranApp from "../../../components/LFortranApp";
import { getAllCommits, getCommitFromJson } from "../../../utils/commit_handler";
import MyHeader from "../../../components/MyHeader";
import MyFooter from "../../../components/MyFooter";
import { Content } from "antd/lib/layout/layout";

function index({ commits, commit }) {
    return (
        <>
            <MyHeader commits={commits}></MyHeader>
            <Content style={{ padding: "10px 20px" }}>
                <LFortranApp commit={commit} />
            </Content>
            <MyFooter></MyFooter>
        </>);
}

export const getStaticProps = async (context) => {
    // const res = await fetch(`${server}/api/commits/${context.params.id}`);
    // const commit = await res.json();

    const commit = await getCommitFromJson(context.params.id);
    console.log(commit);

    return {
        props: {
            commit: commit
        },
    };
};

export const getStaticPaths = async () => {
    // const res = await fetch(`${server}/api/commits`);
    // const commits = await res.json();

    const commits = await getAllCommits();

    const ids = commits.map((commit) => commit.commit);
    const paths = ids.map((id) => ({ params: { id: id.toString() } }));
    return {
        paths,
        fallback: false,
    };
};

export default index;
