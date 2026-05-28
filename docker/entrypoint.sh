#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-http://openebs-api-rest:8081}"

sed "s|__API_BASE_URL__|${API_BASE_URL}|g" \
  /usr/share/caddy/env-config.js.template \
  > /usr/share/caddy/env-config.js

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
