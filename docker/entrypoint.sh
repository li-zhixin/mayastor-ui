#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-}"
API_UPSTREAM="${API_UPSTREAM:-http://openebs-api-rest:8081}"
BASE_PATH="${BASE_PATH:-/}"

case "$BASE_PATH" in
  /*) ;;
  *) BASE_PATH="/$BASE_PATH" ;;
esac

while [ "$BASE_PATH" != "/" ] && [ "${BASE_PATH%/}" != "$BASE_PATH" ]; do
  BASE_PATH="${BASE_PATH%/}"
done

[ -n "$BASE_PATH" ] || BASE_PATH="/"

sed -e "s|__API_BASE_URL__|${API_BASE_URL}|g" \
  -e "s|__BASE_PATH__|${BASE_PATH}|g" \
  /usr/share/caddy/env-config.js.template \
  > /usr/share/caddy/env-config.js

if [ "$BASE_PATH" = "/" ]; then
  cat > /etc/caddy/Caddyfile <<EOF
:80 {
	root * /usr/share/caddy

	route {
		@envConfig path /env-config.js
		header @envConfig Cache-Control "no-store"

		handle /v0/* {
			reverse_proxy ${API_UPSTREAM}
		}

		try_files {path} /index.html
		file_server
	}
}
EOF
else
  cat > /etc/caddy/Caddyfile <<EOF
:80 {
	root * /usr/share/caddy

	route {
		@envConfig path /env-config.js ${BASE_PATH}/env-config.js
		header @envConfig Cache-Control "no-store"

		handle ${BASE_PATH}/v0/* {
			uri strip_prefix ${BASE_PATH}
			reverse_proxy ${API_UPSTREAM}
		}

		handle /v0/* {
			reverse_proxy ${API_UPSTREAM}
		}

		redir ${BASE_PATH} ${BASE_PATH}/ 308

		handle ${BASE_PATH}/* {
			uri strip_prefix ${BASE_PATH}
			try_files {path} /index.html
			file_server
		}

		try_files {path} /index.html
		file_server
	}
}
EOF
fi

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
