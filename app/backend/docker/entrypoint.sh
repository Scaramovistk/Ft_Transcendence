#!/bin/sh

python3 -m venv venv
source venv/bin/activate
python ./src/manage.py makemigrations
python ./src/manage.py migrate

supervisord -c /etc/supervisor/conf.d/supervisord.conf