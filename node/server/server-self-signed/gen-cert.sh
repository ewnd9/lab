#!/bin/sh

# https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2#.q1nk6wiwv

cd cert

# Create a new certificate authority using the configuration.
openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem

# We have our certificate authority in ca-key.pem and ca-crt.pem
# Let’s generate a private key for the server.
openssl genrsa -out server-key.pem 4096

#  generate the certificate signing request.
openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem

# let’s sign the request.
openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem

openssl genrsa -out client1-key.pem 4096
openssl req -new -config client1.cnf -key client1-key.pem -out client1-csr.pem
openssl x509 -req -extfile client1.cnf -days 999 -passin "pass:password" -in client1-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client1-crt.pem

openssl genrsa -out client2-key.pem 4096
openssl req -new -config client2.cnf -key client2-key.pem -out client2-csr.pem
openssl x509 -req -extfile client2.cnf -days 999 -passin "pass:password" -in client2-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client2-crt.pem

openssl verify -CAfile ca-crt.pem client1-crt.pem
openssl verify -CAfile ca-crt.pem client2-crt.pem

cd -
