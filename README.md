# mayastor-ui

English | [简体中文](./README.zh-CN.md)

Kubernetes UI for Mayastor / OpenEBS.

This project deploys the UI only. It expects an existing Mayastor REST API.

## Prerequisite

Install OpenEBS Replicated Storage / Mayastor first:

https://openebs.io/docs/quickstart-guide/installation

## How API Access Works

By default, the browser calls the UI origin:

```text
/v0/*
```

The Caddy server inside the UI container proxies that request to:

```text
http://openebs-api-rest:8081
```

This works when `mayastor-ui` and `openebs-api-rest` are in the same namespace. For a different API Service name or namespace, set `api.upstream`.

## Deploy At Root

```bash
git clone https://github.com/li-zhixin/mayastor-ui.git
cd mayastor-ui

helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --create-namespace
```

Temporary access with port-forward:

```bash
kubectl port-forward -n openebs svc/mayastor-ui 8080:80
```

Open:

```text
http://127.0.0.1:8080
```

## Deploy Under A Path

For `/mayastor`, set both `api.basePath` and the Ingress path:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.basePath=/mayastor \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=mayastor-ui.example.com \
  --set ingress.hosts[0].paths[0].path=/mayastor \
  --set ingress.hosts[0].paths[0].pathType=Prefix
```

Then open:

```text
https://mayastor-ui.example.com/mayastor/
```

The browser calls `/mayastor/v0/*`; Caddy strips `/mayastor` and proxies to `api.upstream`.

## Common Overrides

Use a different in-cluster API upstream:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.upstream=http://openebs-api-rest.openebs.svc.cluster.local:8081
```

Use an API address that is directly reachable by the browser:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.baseUrl=https://mayastor-api.example.com
```

Pin a published image:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set image.repository=ghcr.io/li-zhixin/mayastor-ui \
  --set image.tag=v0.0.1
```

## Notes

- Default image: `ghcr.io/li-zhixin/mayastor-ui`
- Helm chart: `chart/mayastor-ui`
- Default `api.upstream`: `http://openebs-api-rest:8081`
- Local development: [dev.md](./dev.md)
