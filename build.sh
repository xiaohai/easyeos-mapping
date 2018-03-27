#!/bin/sh

npm install
npm run build
docker build -t eos-mapping .