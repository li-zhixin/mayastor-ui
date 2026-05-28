# mayastor-ui

[English](./README.md) | 简体中文

`mayastor-ui` 是一个面向 Kubernetes 的 Mayastor/OpenEBS 管理界面。这个仓库提供：

- 发布到 `GHCR` 的前端镜像
- 用于部署 UI 的 `Helm chart`
- 面向已安装 OpenEBS/Mayastor 集群的接入说明

这个仓库不负责安装 OpenEBS/Mayastor 本体，只负责部署 UI 并连接已有 REST API。

## 前置条件

在部署 UI 之前，请先完成 OpenEBS Replicated Storage / Mayastor 安装。

- OpenEBS 安装文档：
  `https://openebs.io/docs/quickstart-guide/installation`
- 集群中需要已经存在可访问的 Mayastor REST API 服务

推荐将 UI 与 `openebs-api-rest` 部署在同一个 namespace，这样默认配置即可使用：

```text
http://openebs-api-rest:8081
```

如果 REST API 位于其他 namespace、通过 Ingress 暴露，或者使用外部地址，可以通过 Helm values 覆盖。

## 镜像发布

默认镜像仓库：

```text
ghcr.io/li-zhixin/mayastor-ui
```

GitHub Actions 会在以下场景执行构建：

- Push 到 `main`
- Push 版本标签，如 `v0.1.0`
- Pull Request 中执行构建和 Helm 校验

默认标签策略：

- `latest`
- `sha-<commit>`
- `vX.Y.Z`

## 使用 Helm 部署

### 1. 拉取仓库

```bash
git clone https://github.com/li-zhixin/mayastor-ui.git
cd mayastor-ui
```

### 2. 安装到与 OpenEBS API 相同的 namespace

如果 `openebs-api-rest` 与 UI 在同一个 namespace，可以直接使用默认值安装：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --create-namespace
```

默认 API 配置：

```yaml
api:
  baseUrl: http://openebs-api-rest:8081
```

### 3. 暴露服务

Chart 默认使用 `ClusterIP`。你可以选择：

- 通过 `kubectl port-forward` 访问
- 启用 Ingress
- 改成 `LoadBalancer`

示例：启用 Ingress

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set ingress.enabled=true \
  --set ingress.className=nginx \
  --set ingress.hosts[0].host=mayastor-ui.example.com
```

示例：改成 `LoadBalancer`

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set service.type=LoadBalancer
```

## 常用配置

### 连接不同 namespace 或集群外 API

如果 `openebs-api-rest` 不在同一个 namespace，可以显式指定完整 Service DNS：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace mayastor-ui \
  --create-namespace \
  --set api.baseUrl=http://openebs-api-rest.openebs.svc.cluster.local:8081
```

如果 API 通过域名暴露：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace mayastor-ui \
  --set api.baseUrl=https://openebs-api.example.com
```

### 固定镜像标签

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  --set image.repository=ghcr.io/li-zhixin/mayastor-ui \
  --set image.tag=sha-abcdef1
```

### 通过 values 文件部署

`values-production.yaml`

```yaml
image:
  repository: ghcr.io/li-zhixin/mayastor-ui
  tag: latest

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: mayastor-ui.example.com
      paths:
        - path: /
          pathType: Prefix

api:
  baseUrl: http://openebs-api-rest:8081
```

安装：

```bash
helm upgrade --install mayastor-ui ./chart/mayastor-ui \
  --namespace openebs \
  -f values-production.yaml
```

## Chart 内容

Helm chart 位于：

```text
chart/mayastor-ui
```

默认包含：

- `Deployment`
- `Service`
- `Ingress`
- `ServiceAccount`
- 可选 `HPA`

## GitHub Actions

工作流文件：

```text
.github/workflows/release.yml
```

它会执行：

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `helm lint chart/mayastor-ui`
5. `helm template mayastor-ui chart/mayastor-ui`
6. 在 `main` 和版本 tag 上发布 GHCR 镜像

## 本地开发

本地开发和镜像验证说明见 [dev.zh-CN.md](./dev.zh-CN.md)。
