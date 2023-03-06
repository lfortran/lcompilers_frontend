#!/bin/bash

set -ex

# Set a specific commit to use:
latest_commit="c969e0bc3"
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.js" -o public/lfortran.js
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.wasm" -o public/lfortran.wasm
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.data" -o public/lfortran.data

echo "{ \"id\": \"${latest_commit}\" }" > utils/commit.json

export MY_ENV=$([[ ${GITHUB_REF} == "refs/heads/main" ]] && echo "production" || echo "development")
npm run build
