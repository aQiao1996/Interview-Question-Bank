# DevOps

这里用于整理 DevOps 和部署运维相关面试题，后续按 Docker、Nginx、CI/CD、日志、监控告警、灰度发布、回滚、Kubernetes 基础等方向追加。

## 1、Docker 镜像分层是什么，有什么好处
Docker 镜像由多层只读文件系统组成，每一条 Dockerfile 指令通常会生成一层。容器运行时会在镜像层之上增加一个可写层。

::: details 详情
### 分层示例

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
```

这些指令会形成多个镜像层。

### 好处

镜像分层的主要好处：

- 复用缓存，提升构建速度。
- 多个镜像可以共享相同基础层。
- 推送和拉取镜像时只传输变化层。
- 便于理解镜像构建过程。

### 构建缓存

Docker 构建时会从上到下判断缓存是否可复用。

如果某一层发生变化，它后面的层通常都需要重新构建。

所以常见优化是先复制依赖描述文件，再安装依赖：

```dockerfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
```

这样业务代码变化时，不一定需要重新安装依赖。

### 容器可写层

容器启动后新增一个可写层。容器内写入的文件通常只存在于当前容器中，删除容器后也会丢失。

需要持久化的数据应该使用 volume、对象存储或数据库。

### 注意事项

- 不要把密钥写进镜像层，删除也可能留在历史层中。
- 合理安排 Dockerfile 指令顺序可以提高缓存命中率。
- 多阶段构建可以减少最终镜像体积。
- 镜像越小，部署和拉取通常越快。
:::

## 2、Nginx 反向代理有什么作用
Nginx 反向代理是指客户端请求先到 Nginx，再由 Nginx 转发到后端服务。它常用于统一入口、负载均衡、静态资源服务、HTTPS 终止和跨域处理。

::: details 详情
### 正向代理和反向代理

- 正向代理代理客户端，服务端不知道真实客户端是谁。
- 反向代理代理服务端，客户端通常不知道后面具体是哪台服务。

常见 Web 部署中，Nginx 多数作为反向代理。

### 基本配置

```nginx
server {
  listen 80;
  server_name example.com;

  location /api/ {
    proxy_pass http://127.0.0.1:3000/;
  }
}
```

访问 `example.com/api/users` 时，请求会被转发到后端服务。

### 常见作用

- 统一对外域名和端口。
- 转发请求到后端服务。
- 做负载均衡。
- 托管静态资源。
- 配置 HTTPS 证书。
- 开启 gzip 或 brotli 压缩。
- 配置缓存。
- 处理跨域响应头。

### 反向代理注意请求头

常见需要传递的头：

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

后端可以通过这些信息识别真实来源和协议。

### 注意事项

- `proxy_pass` 路径末尾是否带 `/` 会影响转发路径。
- 上传大文件要配置请求体大小限制。
- WebSocket 需要额外配置连接升级头。
- 日志、超时、缓存和错误页要结合业务场景配置。
:::

## 3、蓝绿发布和灰度发布有什么区别
蓝绿发布和灰度发布都是降低上线风险的部署策略。蓝绿发布通过两套环境快速切换流量，灰度发布通过逐步放量观察新版本表现。

::: details 详情
### 蓝绿发布

蓝绿发布准备两套环境：

```txt
蓝环境：当前线上版本
绿环境：新版本
```

新版本先部署到绿环境，验证通过后把流量从蓝环境切到绿环境。

如果发现问题，可以快速切回蓝环境。

### 灰度发布

灰度发布是逐步把部分流量切到新版本：

```txt
1% -> 5% -> 20% -> 50% -> 100%
```

期间观察错误率、延迟、核心业务指标和用户反馈。

### 二者区别

- 蓝绿发布切换更快，但需要两套完整环境。
- 灰度发布更适合逐步验证，但链路和流量控制更复杂。
- 蓝绿更偏环境切换。
- 灰度更偏流量比例和用户分组控制。

### 适合场景

蓝绿发布适合：

- 环境成本可接受。
- 希望快速回滚。
- 新旧版本不能混合太久。

灰度发布适合：

- 用户规模大。
- 希望逐步验证风险。
- 新版本可能只对部分用户开放。

### 注意事项

- 数据库变更要兼容新旧版本。
- 回滚不等于数据自动回滚。
- 要提前准备监控、告警和回滚方案。
- 灰度规则可以按用户、地区、设备、租户或流量比例划分。
:::

## 4、Kubernetes 中 Pod、Deployment 和 Service 分别是什么
Kubernetes 是容器编排平台，Pod、Deployment 和 Service 是最基础的几个概念，分别对应运行单元、部署管理和服务访问。

::: details 详情
### Pod

Pod 是 Kubernetes 中最小的调度单元。

一个 Pod 中可以包含一个或多个容器，它们共享：

- 网络命名空间。
- 存储卷。
- 部分运行上下文。

大多数业务场景中，一个 Pod 通常运行一个主容器。

### Deployment

Deployment 用于管理 Pod 的副本和发布过程。

它可以控制：

- 副本数量。
- 滚动更新。
- 回滚。
- Pod 模板。
- 扩缩容。

例如期望某个应用始终运行 3 个副本，Deployment 会负责维持这个状态。

### Service

Pod 的 IP 可能会变化，Service 用于为一组 Pod 提供稳定访问入口。

Service 会根据标签选择器找到对应 Pod，并把流量转发过去。

常见类型：

- `ClusterIP`：集群内部访问。
- `NodePort`：通过节点端口访问。
- `LoadBalancer`：通过云厂商负载均衡访问。

### 三者关系

```txt
Deployment 管理 Pod
Service 访问 Pod
```

更完整地说，Deployment 创建 ReplicaSet，ReplicaSet 维护 Pod 副本，Service 通过标签选择器把流量导向 Pod。

### 面试要点

- Pod 是运行单元，不适合单独长期手动管理。
- Deployment 负责声明式部署和副本管理。
- Service 解决 Pod IP 不稳定和负载均衡问题。
- 标签和选择器是 Kubernetes 资源关联的关键。
:::
