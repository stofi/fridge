#!/bin/bash
email=$1
username=$2
password=$3
curl -s 'http://localhost:3030/users/'  -H 'Content-Type: application/json' --data-binary "{ \"email\": \"$email\", \"password\": \"$password\", \"username\": \"$username\" }" | jq .