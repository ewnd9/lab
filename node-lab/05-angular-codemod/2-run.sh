#!/bin/sh

../node_modules/.bin/babel -o babel-plugin-annotate-export-functions.es5.js babel-plugin-annotate-export-functions.js
../node_modules/.bin/babel --presets es2015 --plugins ./babel-plugin-annotate-export-functions.es5.js ./examples/02-export-functions/source.js
