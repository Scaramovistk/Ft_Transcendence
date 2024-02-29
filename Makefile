
build:
	docker-compose -f docker-compose.yml up --build -d

up:
	docker-compose -f docker-compose.yml up

down:
	docker-compose -f docker-compose.yml down -v
	rm -rf app/db/data

clean:
	@docker system prune -af
