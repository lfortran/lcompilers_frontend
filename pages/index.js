import LFortranApp from "../components/LFortranApp";
import { getAllCommits } from "../utils/commit_handler";

export default function Home({ commits }) {
    if (!commits || (commits.length == 0)) {
        return "No commits found to load";
    }
    return <LFortranApp commit={commits[0]} />;
}

export const getStaticProps = async (context) => {
    // const res = await fetch(`${server}/api/commits/${context.params.id}`);
    // const commit = await res.json();

    const commits = await getAllCommits();
    console.log("commits");
    console.log(commits);

    return {
        props: {
            commits,
        },
    };
};
