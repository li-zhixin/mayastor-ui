# mayastor-ui

[English](./README.md) | 简体中文

`mayastor-ui` 是 Mayastor / OpenEBS 的 Kubernetes 管理界面。

这个项目只部署 UI，本身不安装 Mayastor，依赖已有的 Mayastor REST API。

## 部署前

先安装 OpenEBS Replicated Storage / Mayastor：

`https://openebs.io/docs/quickstart-guide/installation`

默认 API 地址：

```text
http://openebs-api-rest:8081
```

当 UI 和 `openebs-api-rest` 在同一个 namespace 时，默认值可直接使用。

## 部署

```bash
git clone https://github.com/li-zhixin/mayastor-ui.git
cd mayastor-ui

helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --create-namespace
```

## 访问

使用端口转发：

```bash
kubectl port-forward -n openebs svc/mayastor-ui 8080:80
```

然后打开：

```text
http://127.0.0.1:8080
```

## 常用覆盖参数

使用其他 API 地址：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.baseUrl=http://openebs-api-rest.openebs.svc.cluster.local:8081
```

使用已发布镜像：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set image.repository=ghcr.io/li-zhixin/mayastor-ui \
  --set image.tag=v0.0.1
```

启用 Ingress：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=mayastor-ui.example.com
```

## 备注

- 默认镜像：`ghcr.io/li-zhixin/mayastor-ui`
- Helm chart：`chart/mayastor-ui`
- 本地开发： [dev.zh-CN.md](./dev.zh-CN.md)
