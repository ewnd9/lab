#!/bin/sh

curl -H "Authorization: Client-ID $1" https://api.imgur.com/3/gallery/r/kittens | jq -r '.data[].link' > images.txt
