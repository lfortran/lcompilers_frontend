#!/bin/bash

# curl https://lfortran.github.io/wasm_builds/data.json -o data.json
latest_commit=`curl https://lfortran.github.io/wasm_builds/dev/latest_commit`
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.js" -o public/lfortran.js
curl "https://lfortran.github.io/wasm_builds/dev/$latest_commit/lfortran.wasm" -o public/lfortran.wasm

npm run build
npm run export
echo "dev.lfortran.org" >> out/CNAME
touch out/.nojekyll
