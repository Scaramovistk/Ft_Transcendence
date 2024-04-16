FROM debian:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
	nginx \
	vim \
	openssl \
	supervisor

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/ssl/private/nginx-selfsigned.key \
	-out /etc/ssl/certs/nginx-selfsigned.crt \
	-subj "/C=BE/L=Brussels/OU=lol/O=loll/CN=localhost/"

COPY public /home/ft_transcendence/public
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /home/ft_transcendence/entrypoint.sh
RUN chmod +x /home/ft_transcendence/entrypoint.sh
COPY docker/env.sh /home/ft_transcendence/env.sh
RUN chmod +x /home/ft_transcendence/env.sh

WORKDIR /home/ft_transcendence
