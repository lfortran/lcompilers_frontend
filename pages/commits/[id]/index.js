import LFortranApp from "../../../components/LFortranApp";
import { getAllCommits, getCommitFromJson } from "../../../utils/commit_handler";

function index({ commit }) {
    return <LFortranApp commit={commit}/>;
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
