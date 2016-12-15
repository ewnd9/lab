#!/bin/sh

ab -k -c 20 -n 250 "http://localhost:3000/auth?username=matt&password=password"
