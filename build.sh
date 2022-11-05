#!/bin/bash

set -ex

# curl https://lfortran.github.io/wasm_builds/data.json -o data.json
#latest_commit=`curl https://lfortran.github.io/wasm_builds/dev/latest_commit`
# Set a specific commit to use:
latest_commit="4fafa6605"
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.js" -o public/lfortran.js
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.wasm" -o public/lfortran.wasm
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.data" -o public/lfortran.data

export MY_ENV=$([[ ${GITHUB_REF} == "refs/heads/main" ]] && echo "production" || echo "development")
npm run build
npm run export
echo "dev.lfortran.org" >> out/CNAME
