#!/bin/sh

../node_modules/.bin/babel -o babel-plugin-annotate-export-default.es5.js babel-plugin-annotate-export-default.js
../node_modules/.bin/babel --presets es2015 --plugins ./babel-plugin-annotate-export-default.es5.js ./examples/01-export-default-controller/source.js
