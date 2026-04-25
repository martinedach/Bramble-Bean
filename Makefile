COMPOSE ?= docker compose
COMPOSE_FILE ?= compose.yaml
PROJECT ?= cafe-review

export COMPOSE_PROJECT_NAME := $(PROJECT)

.PHONY: help start stop up down restart logs ps build

help:
	@echo "Usage:"
	@echo "  make start    Start stack in the background (build images if needed)"
	@echo "  make stop     Stop stack and remove containers (volumes kept)"
	@echo "  make build    Build images without starting"
	@echo "  make restart  stop then start"
	@echo "  make logs     Follow compose logs"
	@echo "  make ps       List compose services"
	@echo ""
	@echo "Compose file: $(COMPOSE_FILE)"

start up:
	$(COMPOSE) -f $(COMPOSE_FILE) up -d --build

build:
	$(COMPOSE) -f $(COMPOSE_FILE) build

stop down:
	$(COMPOSE) -f $(COMPOSE_FILE) down

restart: stop start

logs:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100

ps:
	$(COMPOSE) -f $(COMPOSE_FILE) ps
