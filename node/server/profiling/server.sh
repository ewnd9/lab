#!/bin/sh

rm -f *.log
NODE_ENV=production node --prof index.js $1
