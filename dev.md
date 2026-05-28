# Development

English | [简体中文](./dev.zh-CN.md)

This file only covers local development and local validation. For Kubernetes deployment, see [README.md](./README.md).

## Run Locally

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

If you need a custom API endpoint:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8081 npm run dev
```

## Build Locally

```bash
npm run build
```

## Preview the Production Build

```bash
npm run preview
```

## Build the Container Image

```bash
docker build -t mayastor-ui:local .
```

## Run the Container Locally

Default API address:

```text
http://openebs-api-rest:8081
```

Override it if needed:

```bash
docker run --rm -p 8080:80 \
  -e API_BASE_URL=http://host.docker.internal:8081 \
  mayastor-ui:local
```

Then open:

```text
http://127.0.0.1:8080
```
