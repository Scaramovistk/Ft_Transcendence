#!/bin/sh

bash ./env.sh

supervisord -c /etc/supervisor/conf.d/supervisord.conf