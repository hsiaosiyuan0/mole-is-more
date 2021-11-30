#!/usr/bin/env bash

git submodule init
git submodule foreach git pull origin master

cd mole
make mole_wasm
cp -rf mole.wasm ../src/assets/