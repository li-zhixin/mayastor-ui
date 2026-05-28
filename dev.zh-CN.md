# Development

[English](./dev.md) | 简体中文

这个文件只说明本地开发和本地验证。面向 Kubernetes 的部署说明见 [README.zh-CN.md](./README.zh-CN.md)。

## 本地运行

安装依赖：

```bash
npm ci
```

启动开发服务器：

```bash
npm run dev
```

如果需要指定自定义 API：

```bash
VITE_API_BASE_URL=http://127.0.0.1:8081 npm run dev
```

## 本地构建

```bash
npm run build
```

## 预览生产构建结果

```bash
npm run preview
```

## 构建容器镜像

```bash
docker build -t mayastor-ui:local .
```

## 本地运行容器

默认 API 地址：

```text
http://openebs-api-rest:8081
```

需要覆盖时：

```bash
docker run --rm -p 8080:80 \
  -e API_BASE_URL=http://host.docker.internal:8081 \
  mayastor-ui:local
```

然后访问：

```text
http://127.0.0.1:8080
```
