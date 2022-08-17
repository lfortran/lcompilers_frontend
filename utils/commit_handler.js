import path from 'path'
import fs from 'fs'

const dataPath = path.join(process.cwd(), 'data.json');

export async function getAllCommits() {
    const jsonString = fs.readFileSync(dataPath);
    const commits = JSON.parse(jsonString)["dev"];
    return commits;
}

export async function getCommitFromJson(commitId) {
    const commits = await getAllCommits();
    var reqCommit = commits.find((currentCommmit)=> {
        return currentCommmit.lfortran_commit_sha === commitId
    });
    return reqCommit;
}
