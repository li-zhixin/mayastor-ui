# mayastor-ui

English | [简体中文](./README.zh-CN.md)

Kubernetes UI for Mayastor / OpenEBS.

This project deploys the UI only. It expects an existing Mayastor REST API.

## Before You Deploy

Install OpenEBS Replicated Storage / Mayastor first:

`https://openebs.io/docs/quickstart-guide/installation`

Default API address:

```text
http://openebs-api-rest:8081
```

This works when the UI and `openebs-api-rest` are in the same namespace.

## Deploy

```bash
git clone https://github.com/li-zhixin/mayastor-ui.git
cd mayastor-ui

helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --create-namespace
```

## Access

Port-forward:

```bash
kubectl port-forward -n openebs svc/mayastor-ui 8080:80
```

Then open:

```text
http://127.0.0.1:8080
```

## Common Overrides

Use another API address:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.baseUrl=http://openebs-api-rest.openebs.svc.cluster.local:8081
```

Use the published image:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set image.repository=ghcr.io/li-zhixin/mayastor-ui \
  --set image.tag=v0.0.1
```

Enable Ingress:

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=mayastor-ui.example.com
```

## Notes

- Default image: `ghcr.io/li-zhixin/mayastor-ui`
- Helm chart: `chart/mayastor-ui`
- Local development: [dev.md](./dev.md)
