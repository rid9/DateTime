#!/usr/bin/env bash

dir="$(realpath "${0%/*}")"

if ! [ -d "${dir}/out" ]; then
    mkdir "${dir}/out"
fi &&

rm -rf "${dir}/build" &&
mkdir "${dir}/build" &&

cp "${dir}/src/"*.ts "${dir}/build" &&
cp "${dir}/tsconfig.json" "${dir}/build" &&

(
    cd "${dir}/build" &&

    for l in ../node_modules/dayjs/locale/*.js; do
        echo "import \"dayjs/locale/$(basename "$l" | cut -d. -f1)\";" >> ./locales.ts
    done &&

    sed -i.bak 's/^\(import .* from "dayjs";.*\)$/\1 import ".\/locales";/' ./extension.ts;

    esbuild \
        --bundle \
        --format=iife \
        --charset=utf8 \
        --external:vscode \
        --outfile=./extension.js \
        --target=es2017 \
        ./extension.ts &&

    mv ./extension.js "${dir}/out/" &&

    rm -rf "${dir}/build"
)
