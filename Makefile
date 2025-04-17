createdb:
	docker exec -it postgres17 createdb bash
createdb_test:
	docker exec -it postgres17 createdb bash_test
dropdb:
	docker exec -it postgres17 dropdb bash
dropdb_test:
	docker exec -it postgres17 dropdb bash_test
run_pgadmin:
	docker run --name pgadmin -p 80:80 -e PGADMIN_DEFAULT_EMAIL=root@localhost.com \
	-e PGADMIN_DEFAULT_PASSWORD=password -d dpage/pgadmin4
start_postgres:
	docker start postgres17
start_pgadmin:
	docker start pgadmin
start_pgadmin_postgres:
	make start_postgres && make start_pgAdmin
PHONY: createdb start_postgres dropdb run_pgAdmin start_pgAdmin start_pgAdmin_postgres createdb_test dropdb_test
