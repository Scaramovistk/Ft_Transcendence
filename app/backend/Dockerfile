FROM debian:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
	nginx \
	vim \
	python3 \
	python3-pip \
	python3-venv \
	openssl \
	supervisor

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/ssl/private/nginx-selfsigned.key \
	-out /etc/ssl/certs/nginx-selfsigned.crt \
	-subj "/C=BE/L=Brussels/OU=lol/O=loll/CN=localhost/"

COPY src /home/ft_transcendence/src
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /home/ft_transcendence/entrypoint.sh
RUN chmod +x /home/ft_transcendence/entrypoint.sh
COPY docker/entrypoint.sh /home/ft_transcendence/entrypoint.sh
RUN chmod +x /home/ft_transcendence/entrypoint.sh
WORKDIR /home/ft_transcendence

ENV PYTHONBUFFERED 1

RUN python3 -m venv venv
RUN . venv/bin/activate
RUN venv/bin/pip3 install -r src/requirements.txt
