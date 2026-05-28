# mayastor-ui

[English](./README.md) | 简体中文

`mayastor-ui` 是 Mayastor / OpenEBS 的 Kubernetes 管理界面。

这个项目只部署 UI，本身不安装 Mayastor，依赖已有的 Mayastor REST API。

## 前置条件

先安装 OpenEBS Replicated Storage / Mayastor：

https://openebs.io/docs/quickstart-guide/installation

## API 访问方式

默认情况下，浏览器请求 UI 同源地址：

```text
/v0/*
```

UI 容器内的 Caddy 会把请求转发到：

```text
http://openebs-api-rest:8081
```

当 `mayastor-ui` 和 `openebs-api-rest` 在同一个 namespace 时，默认值可直接使用。如果 API Service 名称或 namespace 不同，设置 `api.upstream`。

## 根路径部署

```bash
git clone https://github.com/li-zhixin/mayastor-ui.git
cd mayastor-ui

helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --create-namespace
```

临时访问可以使用端口转发：

```bash
kubectl port-forward -n openebs svc/mayastor-ui 8080:80
```

然后打开：

```text
http://127.0.0.1:8080
```

## 子路径部署

例如部署到 `/mayastor`，同时设置 `api.basePath` 和 Ingress path：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.basePath=/mayastor \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=mayastor-ui.example.com \
  --set ingress.hosts[0].paths[0].path=/mayastor \
  --set ingress.hosts[0].paths[0].pathType=Prefix
```

然后打开：

```text
https://mayastor-ui.example.com/mayastor/
```

浏览器会请求 `/mayastor/v0/*`；Caddy 会移除 `/mayastor` 前缀并转发到 `api.upstream`。

## 常用覆盖参数

使用不同的集群内 API upstream：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.upstream=http://openebs-api-rest.openebs.svc.cluster.local:8081
```

使用浏览器可直接访问的 API 地址：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set api.baseUrl=https://mayastor-api.example.com
```

指定已发布镜像：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set image.repository=ghcr.io/li-zhixin/mayastor-ui \
  --set image.tag=v0.0.1
```

## 备注

- 默认镜像：`ghcr.io/li-zhixin/mayastor-ui`
- Helm chart：`chart/mayastor-ui`
- 默认 `api.upstream`：`http://openebs-api-rest:8081`
- 本地开发： [dev.zh-CN.md](./dev.zh-CN.md)
