#!/bin/bash

CONFIG_FILE="public/config.js"

echo "export default {" > $CONFIG_FILE

for var in $(printenv | awk -F= '{print $1}')
do
  value=$(printenv $var)

  echo "  $var: \"$value\"," >> $CONFIG_FILE
done

echo "}" >> $CONFIG_FILE
