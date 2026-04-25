# Root Makefile: Docker Compose wrapper for cafe-review (see README.md).
# Requires Docker Compose v2 (`docker compose`).

.DEFAULT_GOAL := help

COMPOSE ?= docker compose
COMPOSE_FILE ?= compose.yaml
PROJECT ?= cafe-review

export COMPOSE_PROJECT_NAME := $(PROJECT)

.PHONY: help start stop up down restart logs ps build down-volumes

help:
	@echo "cafe-review — Docker Compose shortcuts"
	@echo ""
	@echo "  make start         Start app + database (build images if needed)"
	@echo "  make stop          Stop and remove containers (Postgres volume kept)"
	@echo "  make restart       stop then start"
	@echo "  make build         Build images only"
	@echo "  make logs          Follow service logs (last 100 lines, then stream)"
	@echo "  make ps            List compose services"
	@echo "  make down-volumes  Stop stack and remove named volumes (wipes DB)"
	@echo ""
	@echo "Aliases: make up (= start), make down (= stop)"
	@echo "Compose file: $(COMPOSE_FILE)  |  project: $(PROJECT)"

start up:
	$(COMPOSE) -f $(COMPOSE_FILE) up -d --build

build:
	$(COMPOSE) -f $(COMPOSE_FILE) build

stop down:
	$(COMPOSE) -f $(COMPOSE_FILE) down

down-volumes:
	$(COMPOSE) -f $(COMPOSE_FILE) down -v

restart: stop start

logs:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100

ps:
	$(COMPOSE) -f $(COMPOSE_FILE) ps
