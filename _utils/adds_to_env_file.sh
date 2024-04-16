#!/bin/sh

# @$1 .env file 

file=$(sed '/^FRONTEND_URL/d;/^BACKEND_URL/d;/^FRONTEND_IP/d;/^WSS_BACKEND_URL/d' $1)

cd "$(dirname "$1")"
file_dir="$(PWD)"

echo "$file" > $file_dir/.env
printf "FRONTEND_URL=https://$(ipconfig getifaddr en0)\n" >> $file_dir/.env
printf "BACKEND_URL=https://$(ipconfig getifaddr en0)\n" >> $file_dir/.env
printf "FRONTEND_IP=$(ipconfig getifaddr en0)\n" >> $file_dir/.env
printf "WSS_BACKEND_URL=wss://$(ipconfig getifaddr en0)\n" >> $file_dir/.env