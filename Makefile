all: build up

env:
	./_utils/adds_to_env_file.sh ./.env

build: env
	docker-compose -f docker-compose.yml build

up: env
	docker-compose -f docker-compose.yml up -d
	@echo $(BGreen)√$(Color_Off)$(BBlue)Containers created and started.;
	@echo $(BBlue)Frontend$(BGreen)$(shell sed -n 's/^FRONTEND_URL=//p' ./.env):$(shell sed -n 's/^FRONTEND_PORT=//p' ./.env);
	@echo $(BBlue)Backend$(BGreen)$(shell sed -n 's/^BACKEND_URL=//p' ./.env):$(shell sed -n 's/^BACKEND_PORT=//p' ./.env) $(Color_Off);
	
down:
	docker-compose -f docker-compose.yml down -v

logs:
	docker compose -f docker-compose.yml logs -f

clean: down
	find app/db -mindepth 1 ! -name .gitignore -delete
	find app/backend/src/core/migrations/ -mindepth 1 ! -name __init__.py -delete
	find app/backend/src/logs -mindepth 1 ! -name .gitignore -delete
	find app/frontend/public/logs -mindepth 1 ! -name .gitignore -delete
	rm -rf app/backend/src/media

fclean: clean
	docker volume prune -f
	docker image prune -af
	docker builder prune -af

# Colors
## Reset
Color_Off='\033[0m'       # Text Reset
## Regular Colors
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White
## Bold
BBlack='\033[1;30m'       # Black
BRed='\033[1;31m'         # Red
BGreen='\033[1;32m'       # Green
BYellow='\033[1;33m'      # Yellow
BBlue='\033[1;34m'        # Blue
BPurple='\033[1;35m'      # Purple
BCyan='\033[1;36m'        # Cyan
BWhite='\033[1;37m'       # White
## Underline
UBlack='\033[4;30m'       # Black
URed='\033[4;31m'         # Red
UGreen='\033[4;32m'       # Green
UYellow='\033[4;33m'      # Yellow
UBlue='\033[4;34m'        # Blue
UPurple='\033[4;35m'      # Purple
UCyan='\033[4;36m'        # Cyan
UWhite='\033[4;37m'       # White
## Background
On_Black='\033[40m'       # Black
On_Red='\033[41m'         # Red
On_Green='\033[42m'       # Green
On_Yellow='\033[43m'      # Yellow
On_Blue='\033[44m'        # Blue
On_Purple='\033[45m'      # Purple
On_Cyan='\033[46m'        # Cyan
On_White='\033[47m'       # White
## Bold High Intensity
BIBlack='\033[1;90m'      # Black
BIRed='\033[1;91m'        # Red
BIGreen='\033[1;92m'      # Green
BIYellow='\033[1;93m'     # Yellow
BIBlue='\033[1;94m'       # Blue