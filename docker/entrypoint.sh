#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-}"
BASE_PATH="${BASE_PATH:-/}"

sed -e "s|__API_BASE_URL__|${API_BASE_URL}|g" \
  -e "s|__BASE_PATH__|${BASE_PATH}|g" \
  /usr/share/caddy/env-config.js.template \
  > /usr/share/caddy/env-config.js

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
