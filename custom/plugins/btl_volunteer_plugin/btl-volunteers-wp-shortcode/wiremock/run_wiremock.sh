#!/usr/bin/env bash

if [[ "$(docker images -q wiremock:local 2>/dev/null)" == "" ]]; then
  echo "Wiremock image does not exist locally. Building now..."
  docker build . -t wiremock:local
fi

echo "Starting wiremock..."

docker rm -f wiremock > /dev/null 2>&1
docker run -d --name wiremock --mount type=bind,source="$(pwd)",target=/wiremock -p 8080:8080 wiremock:local
echo "Wiremock is running on http://localhost:8080"
