#!/usr/bin/env bash

# shut down running docker containers and delete volumes
sudo docker-compose down --volumes

# rebuild docker images
sudo docker-compose build --no-cache --force-rm --build-arg prkey="$(cat ~/.ssh/id_rsa)" --build-arg pukey="$(cat ~/.ssh/id_rsa.pub)" frontend

# start docker containers
sudo docker-compose up -d
