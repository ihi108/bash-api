createdb:
	docker exec -it postgres17 createdb bash
dropdb:
	docker exec -it postgres17 dropdb bash
run_pgadmin:
	docker run --name pgadmin -p 80:80 -e PGADMIN_DEFAULT_EMAIL=root@localhost.com \
	-e PGADMIN_DEFAULT_PASSWORD=password -d dpage/pgadmin4
start_postgres:
	docker start postgres17
start_pgadmin:
	docker start pgadmin
start_pgadmin_postgres:
	make start_postgres && make start_pgAdmin
PHONY: createdb start_postgres dropdb run_pgAdmin start_pgAdmin start_pgAdmin_postgres
