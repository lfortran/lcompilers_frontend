#/usr/bin/bash

set -ex

deploy_repo_pull="https://github.com/Shaikh-Ubaid/pull_request_preview.git"
deploy_repo_push="git@github.com:Shaikh-Ubaid/pull_request_preview.git"

mkdir ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts
eval "$(ssh-agent -s)"

D=`pwd`

mkdir $HOME/repos
cd $HOME/repos

git clone ${deploy_repo_pull} pr_preview
cd pr_preview
git fetch origin
git checkout gh-pages
rm -rf *
mv $D/deploy/* .

git config user.email "noreply@deploy"
git config user.name "Deploy"

git add .
COMMIT_MESSAGE="Deploying on $(date "+%Y-%m-%d %H:%M:%S")"
git commit -m "${COMMIT_MESSAGE}"

if [[ "${GIT_PR_PREVIEW_PRIVATE_SSH_KEY}" == "" ]]; then
    echo "Note: GIT_PR_PREVIEW_PRIVATE_SSH_KEY is empty, skipping..."
    exit 0
fi
ssh-add <(echo "$GIT_PR_PREVIEW_PRIVATE_SSH_KEY" | base64 -d)

git push ${deploy_repo_push} gh-pages:gh-pages
