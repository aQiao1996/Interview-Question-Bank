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

## 5、Docker 多阶段构建有什么作用
Docker 多阶段构建用于把构建环境和运行环境分离，减少最终镜像体积，避免把源码、构建工具和中间产物带到生产镜像中。

::: details 详情
### 基本示例

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

第一阶段负责安装依赖和构建，第二阶段只保留最终静态产物。

### 好处

- 减少最终镜像体积。
- 降低攻击面。
- 避免暴露源码和构建依赖。
- 构建流程更清晰。
- 运行镜像只包含运行所需内容。

### 后端服务示例

对于 Go、Java、Node 等服务，也可以用构建阶段生成产物，再复制到更小的运行镜像。

```dockerfile
COPY --from=builder /app/server ./server
```

### 和普通构建的区别

普通 Dockerfile 可能把安装依赖、构建工具、源码、缓存都留在最终镜像里。

多阶段构建可以只复制需要的产物。

### 注意事项

- 不要把 `.env`、密钥、私有配置复制进镜像。
- 要合理使用 `.dockerignore`。
- 构建阶段和运行阶段的系统依赖要匹配。
- 最终镜像要保留必要的运行时文件和健康检查能力。
:::

## 6、CI/CD 流水线通常包含哪些阶段
CI/CD 流水线用于把代码从提交、验证、构建到部署的过程自动化，减少人为操作错误，提高交付效率和质量。

::: details 详情
### CI 阶段

CI 是持续集成，常见步骤包括：

- 拉取代码。
- 安装依赖。
- 代码格式检查。
- lint 检查。
- 类型检查。
- 单元测试。
- 构建产物。

目标是在代码合并前尽早发现问题。

### CD 阶段

CD 是持续交付或持续部署，常见步骤包括：

- 构建镜像。
- 推送镜像仓库。
- 部署到测试环境。
- 自动化验收。
- 灰度发布。
- 生产发布。
- 回滚。

### 常见质量门禁

流水线中可以设置门禁：

- 测试必须通过。
- 构建必须成功。
- 代码扫描无高危问题。
- 关键指标达标。
- 生产发布需要人工审批。

### 缓存和加速

CI 中常缓存：

- 包管理器缓存。
- 构建缓存。
- 测试缓存。
- Docker layer cache。

缓存可以提速，但要避免污染构建结果。

### 注意事项

- 流水线失败要能快速定位原因。
- 生产发布要有回滚方案。
- 密钥要通过 CI Secret 管理，不要写入代码。
- 不同环境配置要清晰隔离。
:::

## 7、线上服务监控告警应该关注哪些指标
线上监控告警用于发现系统异常、定位问题和评估服务健康状态。常见指标可以从资源、应用、业务和用户体验几个层面观察。

::: details 详情
### 资源指标

资源层关注机器和容器状态：

- CPU 使用率。
- 内存使用率。
- 磁盘空间。
- 磁盘 IO。
- 网络流量。
- 容器重启次数。

资源异常可能导致接口变慢或服务不可用。

### 应用指标

应用层常见指标：

- QPS。
- 错误率。
- 响应时间。
- P95、P99 延迟。
- 线程池或连接池状态。
- 队列积压。

这些指标能反映服务处理能力和稳定性。

### 业务指标

业务层指标包括：

- 登录成功率。
- 下单成功率。
- 支付成功率。
- 订单量。
- 转化率。

有些故障不会表现为 500 错误，但会影响业务结果。

### 告警设计

告警要注意：

- 阈值合理。
- 分级告警。
- 避免告警风暴。
- 告警要有负责人。
- 告警内容要能辅助定位。

### 注意事项

- 只监控机器资源不够，还要监控业务指标。
- P95、P99 比平均值更能反映用户体验。
- 告警太多会让人麻木。
- 监控、日志、链路追踪要配合使用。
:::

## 8、Kubernetes 如何实现滚动更新和回滚
Kubernetes Deployment 支持滚动更新和回滚，可以在不中断服务的情况下逐步替换旧版本 Pod，并在新版本异常时回退到历史版本。

::: details 详情
### 滚动更新

滚动更新会逐步创建新版本 Pod，同时逐步下线旧版本 Pod。

这样可以避免一次性替换所有实例导致服务不可用。

### 关键参数

Deployment 中常见参数：

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

- `maxSurge`：更新过程中允许额外创建的 Pod 数量。
- `maxUnavailable`：更新过程中允许不可用的 Pod 数量。

### 就绪检查

滚动更新依赖就绪检查：

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000
```

只有新 Pod 就绪后，流量才应该转发过去。

### 回滚

如果新版本有问题，可以回滚到上一个版本：

```bash
kubectl rollout undo deployment app
```

也可以查看发布历史：

```bash
kubectl rollout history deployment app
```

### 注意事项

- 应用要支持优雅关闭。
- 健康检查要能真实反映服务状态。
- 数据库变更要兼容新旧版本。
- 回滚代码不等于回滚数据。
:::

## 9、容器健康检查应该如何设计
容器健康检查用于判断应用是否存活、是否已经准备好接收流量，以及启动阶段是否完成。合理的健康检查可以减少故障实例对线上流量的影响。

::: details 详情
### 常见检查类型

在 Kubernetes 中常见三类探针：

- `livenessProbe`：判断容器是否存活，失败后可能重启容器。
- `readinessProbe`：判断容器是否准备好接收流量，失败后从 Service 后端摘除。
- `startupProbe`：判断应用是否启动完成，适合启动较慢的服务。

### 检查什么

健康检查接口可以检查：

- Web 服务是否能响应。
- 必要配置是否加载完成。
- 关键依赖是否可用。
- 数据库或缓存连接是否正常。
- 当前实例是否处于下线或维护状态。

但检查内容不能过重，否则健康检查本身会给系统带来压力。

### 示例

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
```

### 注意事项

- 存活检查不要依赖太多外部服务，否则下游抖动会导致实例反复重启。
- 就绪检查可以更严格，用来控制是否接收流量。
- 启动慢的服务应配置 `startupProbe`，避免过早被重启。
- 健康检查接口要轻量、稳定，并避免输出敏感信息。
:::

## 10、线上日志采集应该如何设计
线上日志采集用于把分散在各服务、容器和机器上的日志统一收集、存储、查询和告警，帮助定位问题、审计行为和分析系统运行状态。

::: details 详情
### 日志类型

常见日志包括：

- 访问日志。
- 应用日志。
- 错误日志。
- 审计日志。
- 慢请求日志。
- 容器和系统日志。

不同日志关注点不同，不应全部混在一起。

### 采集链路

常见链路是：

```txt
应用输出日志 -> Agent 采集 -> 消息缓冲 -> 日志存储 -> 查询和告警
```

容器环境中通常建议应用输出到 stdout/stderr，再由采集组件统一收集。

### 结构化日志

日志最好使用结构化格式，例如 JSON。

关键字段包括：

- 时间。
- 日志级别。
- 服务名。
- 环境。
- 请求 ID 或 Trace ID。
- 用户或租户标识。
- 错误码和耗时。

### 注意事项

- 日志中不要输出密码、Token、身份证号等敏感信息。
- 高流量接口要控制日志量，避免日志系统被打爆。
- 错误日志要有上下文，但不要堆满无意义字段。
- 日志保留周期要结合法规、成本和排障需求设计。
:::

## 11、不同环境的配置应该如何管理
配置管理用于让同一套代码在开发、测试、预发和生产环境中使用不同参数，例如接口地址、数据库连接、开关配置和第三方密钥。

::: details 详情
### 配置分类

常见配置包括：

- 非敏感配置：接口地址、功能开关、分页大小。
- 敏感配置：数据库密码、Token、私钥。
- 构建期配置：影响前端构建产物的变量。
- 运行时配置：服务启动或运行过程中读取的变量。

不同类型配置要采用不同管理方式。

### 常见方式

- 环境变量。
- 配置文件。
- 配置中心。
- Kubernetes ConfigMap 和 Secret。
- CI/CD 注入。

前端项目尤其要注意：构建进产物的变量通常会被用户看到，不能放密钥。

### 配置中心

配置中心适合需要动态调整的场景，例如：

- 功能开关。
- 灰度规则。
- 限流阈值。
- 降级策略。

重要配置变更应有审批、版本记录和回滚能力。

### 注意事项

- 敏感配置不能提交到代码仓库。
- 环境变量命名要统一，避免不同服务各起一套名字。
- 配置变更要能追踪是谁、什么时候、改了什么。
- 生产配置要有备份和回滚方案。
:::

## 12、Kubernetes 中 requests 和 limits 有什么区别
`requests` 表示容器期望获得的最小资源，用于调度决策；`limits` 表示容器最多能使用的资源，用于限制容器资源上限。

::: details 详情
### requests

`requests` 会影响 Pod 被调度到哪台节点。

例如：

```yaml
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
```

表示该容器希望至少有 0.5 核 CPU 和 512Mi 内存资源。

调度器会根据节点剩余可分配资源决定是否能放下这个 Pod。

### limits

`limits` 用于限制资源上限：

```yaml
resources:
  limits:
    cpu: "1"
    memory: "1Gi"
```

CPU 超过限制通常会被限速，内存超过限制可能触发 OOMKilled。

### 如何设置

设置资源时要参考：

- 历史 CPU 和内存使用量。
- 峰值流量。
- GC 或批处理任务的资源波动。
- 服务重要性。
- 节点资源利用率。

### 注意事项

- requests 设置过高会降低集群利用率。
- requests 设置过低可能导致节点过度超卖。
- memory limit 太低会导致容器频繁 OOM。
- 资源配置要结合监控持续调整，而不是一次性写死。
:::

## 13、Kubernetes Ingress 有什么作用
Ingress 用于管理集群外部访问集群内部服务的 HTTP/HTTPS 路由。它可以根据域名、路径等规则把请求转发到不同 Service。

::: details 详情
### 为什么需要 Ingress

Service 可以暴露集群内部服务，但如果每个服务都使用 LoadBalancer，成本和管理复杂度会很高。

Ingress 提供统一入口，可以集中处理：

- 域名路由。
- 路径路由。
- TLS 证书。
- 转发规则。
- 基础访问控制。

### 基本结构

Ingress 本身只是规则，需要 Ingress Controller 执行这些规则。

常见 Controller：

- Nginx Ingress Controller。
- Traefik。
- HAProxy Ingress。
- 云厂商 Ingress Controller。

### 示例

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

### 注意事项

- Ingress 只定义规则，必须有对应 Controller。
- TLS 证书要有续期和监控。
- 路由规则变更要灰度验证，避免误转发。
- 大流量场景要关注 Ingress Controller 本身的性能和高可用。
:::

## 14、Helm 在 Kubernetes 中有什么作用
Helm 是 Kubernetes 的包管理工具，用于把 Deployment、Service、Ingress、ConfigMap 等资源模板化，并通过 values 配置实现不同环境的复用部署。

::: details 详情
### 为什么需要 Helm

一个应用通常不只有一个 YAML。

可能包含：

- Deployment。
- Service。
- Ingress。
- ConfigMap。
- Secret。
- HPA。
- ServiceAccount。

手工维护大量 YAML 容易重复、出错，也不方便多环境配置。

### Chart

Helm 使用 Chart 描述一个应用的部署包。

常见结构：

```txt
my-chart/
  Chart.yaml
  values.yaml
  templates/
```

`templates` 中是资源模板，`values.yaml` 中是默认配置。

### 常见命令

```bash
helm install app ./chart
helm upgrade app ./chart
helm rollback app 1
helm uninstall app
```

Helm 会记录 release 历史，方便升级和回滚。

### 注意事项

- values 要分环境管理，避免生产配置误用测试值。
- Secret 不应明文提交到仓库。
- 模板不要写得过度复杂，否则难以排查。
- 升级前可以使用 `helm template` 或 `helm diff` 查看实际变更。
:::

## 15、容器镜像安全应该关注什么
容器镜像安全关注基础镜像、依赖漏洞、构建过程、镜像仓库和运行权限，目标是降低供应链攻击和运行时逃逸风险。

::: details 详情
### 基础镜像

基础镜像要选择可信来源。

建议：

- 使用官方或企业内部镜像。
- 固定镜像版本，不要长期使用 `latest`。
- 选择更小的运行时镜像。
- 定期更新基础镜像。

镜像越大，包含的工具和潜在漏洞通常越多。

### 漏洞扫描

CI/CD 中可以加入镜像扫描：

- 系统包漏洞。
- 语言依赖漏洞。
- 高危 CVE。
- 明文密钥。
- 不安全配置。

扫描结果要结合风险等级和可利用性判断处理优先级。

### 构建安全

构建时要注意：

- 不把 `.env`、私钥、Token 打进镜像。
- 使用 `.dockerignore` 排除无关文件。
- 多阶段构建减少最终产物。
- 构建日志不要输出敏感信息。

### 运行权限

运行容器时应尽量：

- 使用非 root 用户。
- 限制 Linux capabilities。
- 设置只读文件系统。
- 限制资源 requests 和 limits。
- 避免挂载宿主机敏感目录。

### 注意事项

- 镜像扫描不是一次性工作，要持续执行。
- 修复漏洞后要重新构建和部署。
- 私有镜像仓库要控制推拉权限。
- 重要镜像可以配合签名和准入控制。
:::

## 16、Kubernetes 滚动发布失败如何排查
Kubernetes 滚动发布失败通常和镜像拉取、启动失败、健康检查失败、资源不足、配置错误或依赖不可用有关。排查要先看 Pod 状态和事件。

::: details 详情
### 先看状态

常用命令：

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl rollout status deployment <name>
```

`describe` 中的 Events 往往能直接看到失败原因。

### 常见原因

常见问题包括：

- `ImagePullBackOff`：镜像不存在、tag 错误或拉取权限不足。
- `CrashLoopBackOff`：应用启动后反复崩溃。
- `Pending`：资源不足或调度约束不满足。
- Readiness Probe 失败：应用未准备好接流量。
- 配置或 Secret 缺失。
- 数据库、缓存等依赖不可用。

### 健康检查

如果 readinessProbe 配置过严，新 Pod 可能一直无法就绪。

如果 livenessProbe 配置不合理，应用可能还没启动完成就被反复重启。

启动慢的服务可以配置 `startupProbe`。

### 回滚

如果新版本影响线上，可以先回滚：

```bash
kubectl rollout undo deployment <name>
```

再保留现场日志和事件继续分析根因。

### 注意事项

- 发布前要确认镜像 tag、配置、Secret 和数据库变更。
- 滚动发布参数要避免可用副本数降到不可接受范围。
- 新旧版本要兼容同一套数据结构。
- 失败排查要保留日志和事件，不要只重启解决。
:::

## 17、Kubernetes HPA 是什么
HPA 是 Horizontal Pod Autoscaler，用于根据 CPU、内存或自定义指标自动调整 Pod 副本数，提升资源利用率和应对流量波动。

::: details 详情
### 基本作用

HPA 会根据指标判断是否扩容或缩容。

例如当 CPU 使用率持续高于目标值时，HPA 会增加副本数。

当负载下降后，再逐步缩容。

### 示例

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
```

### 指标来源

HPA 可以使用：

- CPU。
- 内存。
- QPS。
- 队列长度。
- 自定义业务指标。

自定义指标通常需要 Prometheus Adapter 等组件支持。

### 注意事项

- HPA 依赖 requests 配置，CPU 利用率基于 requests 计算。
- 扩容不是瞬时完成，应用启动时间会影响效果。
- 缩容要谨慎，避免流量抖动导致频繁扩缩。
- 对队列消费类服务，队列长度通常比 CPU 更能反映压力。
:::

## 18、Kubernetes Secret 如何使用更安全
Secret 用于保存密码、Token、证书等敏感配置，并以环境变量或挂载文件的方式提供给 Pod 使用。它比 ConfigMap 更适合敏感数据，但默认并不等于绝对安全。

::: details 详情
### 基本用法

创建 Secret：

```bash
kubectl create secret generic app-secret \
  --from-literal=DB_PASSWORD=xxx
```

在 Pod 中引用：

```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: app-secret
        key: DB_PASSWORD
```

### 安全风险

Secret 默认只是 base64 编码，不是加密。

如果没有额外配置，能读取 Secret 的用户或服务账号就可能看到敏感值。

### 安全实践

建议：

- 开启 etcd 加密。
- 使用 RBAC 限制 Secret 读取权限。
- 不把 Secret 明文提交到 Git。
- 使用外部密钥管理系统。
- 定期轮换密钥。
- 避免在日志中输出环境变量。

### 注意事项

- 环境变量形式可能被进程信息或错误日志泄露。
- 文件挂载形式更便于热更新，但应用要支持重新读取。
- CI/CD 注入 Secret 时也要控制权限和审计。
- Secret 变更后 Pod 不一定自动重启，需要结合部署策略处理。
:::

## 19、livenessProbe、readinessProbe 和 startupProbe 有什么区别
Kubernetes 中三类探针分别解决存活、就绪和启动过程判断问题。合理配置探针可以避免流量打到不可用实例，也能减少误重启。

::: details 详情
### livenessProbe

`livenessProbe` 用于判断容器是否还活着。

如果连续失败，Kubernetes 会重启容器。

适合检测应用死锁、事件循环卡死、无法继续处理请求等问题。

### readinessProbe

`readinessProbe` 用于判断 Pod 是否准备好接收流量。

如果失败，Pod 会从 Service 后端摘除，但不会因此自动重启。

适合检测应用是否完成初始化、依赖是否可用、实例是否处于下线状态。

### startupProbe

`startupProbe` 用于判断应用是否启动完成。

启动探针成功前，其他探针可以暂时不生效，避免启动慢的应用被 livenessProbe 误杀。

适合启动时间较长的服务。

### 如何配置

要根据应用特征设置：

- `initialDelaySeconds`
- `periodSeconds`
- `timeoutSeconds`
- `failureThreshold`

探针接口要轻量，不能执行昂贵逻辑。

### 注意事项

- liveness 不宜检查过多外部依赖，否则下游故障会导致本服务被反复重启。
- readiness 可以比 liveness 更严格，用于控制流量。
- startupProbe 适合解决慢启动问题。
- 探针失败原因要有日志和指标可查。
:::

## 20、Kubernetes 中 taint 和 toleration 有什么作用
taint 和 toleration 用于控制 Pod 是否可以调度到某些节点。节点通过 taint 表示“不欢迎普通 Pod”，Pod 通过 toleration 表示“可以容忍这个 taint”。

::: details 详情
### taint

给节点打污点：

```bash
kubectl taint nodes node1 dedicated=gpu:NoSchedule
```

含义是没有对应 toleration 的 Pod 不能调度到该节点。

### toleration

Pod 中配置容忍：

```yaml
tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
```

这样 Pod 就可以被调度到带有该 taint 的节点。

### 常见 effect

- `NoSchedule`：不调度新的不容忍 Pod。
- `PreferNoSchedule`：尽量不调度。
- `NoExecute`：不容忍的 Pod 会被驱逐。

### 适合场景

- GPU 节点只给特定任务使用。
- 独占节点。
- 系统组件专用节点。
- 故障节点临时驱逐业务 Pod。
- 不同业务隔离部署。

### 注意事项

- toleration 只是允许调度，不保证一定调度到目标节点。
- 如果想指定调度位置，还需要配合 nodeSelector、nodeAffinity。
- taint 配置错误可能导致 Pod 一直 Pending。
- 专用节点要结合资源配额和监控一起管理。
:::

## 21、Kubernetes StatefulSet 适合什么场景
StatefulSet 用于部署有状态应用，提供稳定的网络标识、稳定的存储和有序部署能力。它适合数据库、消息队列、协调服务等需要身份稳定的组件。

::: details 详情
### 和 Deployment 的区别

Deployment 更适合无状态服务。

Pod 可以随时替换，实例之间通常没有身份差异。

StatefulSet 会为每个 Pod 分配稳定名称：

```txt
app-0
app-1
app-2
```

这些名称在重建后仍保持稳定。

### 核心能力

StatefulSet 提供：

- 稳定 Pod 名称。
- 稳定网络标识。
- 稳定存储卷。
- 有序启动。
- 有序删除。
- 有序滚动更新。

### 适合场景

常见场景：

- MySQL。
- Redis 集群。
- Kafka。
- ZooKeeper。
- Elasticsearch。

这些组件通常关心节点身份、数据目录和启动顺序。

### 注意事项

- StatefulSet 不等于自动解决数据高可用，应用自身仍要支持复制和故障恢复。
- 存储卷生命周期要谨慎管理。
- 扩缩容有状态服务前要理解集群协议。
- 生产数据库是否放在 Kubernetes 中，需要结合团队运维能力评估。
:::

## 22、Kubernetes HPA 的扩缩容依据是什么
HPA 用于根据负载自动调整 Pod 副本数，常见依据是 CPU、内存、自定义指标或外部指标。它适合处理流量波动明显、实例可水平扩展的无状态服务。

::: details 详情
### 基本流程

HPA 会周期性读取指标，并根据目标值计算期望副本数。

例如目标 CPU 使用率是 60%，当前平均 CPU 明显高于目标值时，HPA 会增加副本数。

如果负载下降，则会逐步减少副本数。

### 常见指标

常见扩缩容指标包括：

- CPU 使用率。
- 内存使用率。
- QPS。
- 队列长度。
- 消息积压数。
- 自定义业务指标。

CPU 和内存适合通用场景，业务指标更能反映真实压力。

### 注意事项

- 应用必须能水平扩展，不能依赖本地状态。
- 要合理设置 request，否则 CPU 利用率计算不准确。
- 扩容需要镜像拉取、Pod 启动和就绪探针时间。
- 缩容要避免过快，防止流量刚下降就频繁回收实例。
- HPA 不能替代容量规划，突发流量仍要预留缓冲。
:::

## 23、滚动发布和回滚要注意什么
滚动发布是在不中断整体服务的前提下，逐步替换旧版本实例。它的核心是控制发布节奏、观察指标，并在异常时快速回滚到稳定版本。

::: details 详情
### 滚动发布过程

典型过程是：

1. 启动一小部分新版本实例。
2. 等待新实例通过健康检查。
3. 将部分流量切到新版本。
4. 观察错误率、延迟和资源指标。
5. 逐步扩大新版本比例。
6. 下线旧版本实例。

整个过程要避免同时替换过多实例。

### 关键配置

在 Kubernetes Deployment 中，常见配置包括：

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

`maxSurge` 控制最多额外创建多少新 Pod。

`maxUnavailable` 控制发布过程中最多允许多少 Pod 不可用。

### 回滚依据

触发回滚的信号可以包括：

- 错误率升高。
- P95 或 P99 延迟升高。
- 核心业务转化下降。
- Pod 频繁重启。
- 日志出现大量异常。

回滚不能只依赖人工观察，关键服务应接入自动化告警和发布门禁。

### 注意事项

- 数据库变更要兼容新旧版本同时运行。
- 配置变更要可以快速恢复。
- 发布前要确认镜像版本和变更记录。
- 回滚也可能失败，需要有应急预案。
- 发布系统要保留每次发布的操作记录。
:::

## 24、日志、指标和链路追踪分别解决什么问题
日志、指标和链路追踪是可观测性的三个核心手段。日志用于还原事件细节，指标用于观察趋势和告警，链路追踪用于分析一次请求经过了哪些服务以及耗时在哪里。

::: details 详情
### 日志

日志适合回答：

- 某个请求发生了什么。
- 具体异常堆栈是什么。
- 某个用户或订单经历了哪些步骤。
- 某次发布后是否出现了新错误。

日志要包含时间、级别、服务名、traceId 和关键业务字段。

### 指标

指标适合回答：

- 当前 QPS 是多少。
- 错误率是否升高。
- CPU、内存、磁盘是否接近瓶颈。
- P95、P99 延迟是否异常。

指标适合做仪表盘和告警，但通常不能直接给出完整上下文。

### 链路追踪

链路追踪适合分析分布式调用。

它能看到一次请求经过：

- 网关。
- BFF。
- 业务服务。
- 缓存。
- 数据库。
- 第三方接口。

从而定位慢调用、错误节点和跨服务依赖问题。

### 注意事项

- 三者要通过 traceId 或 requestId 关联起来。
- 日志不能记录敏感明文信息。
- 指标标签不能过度膨胀，否则存储成本会很高。
- 链路采样率要在成本和诊断能力之间平衡。
- 告警要基于用户影响，而不只是机器资源。
:::

## 25、Helm 在 Kubernetes 中有什么作用
Helm 是 Kubernetes 的包管理工具，用于把一组 Kubernetes 资源模板化、版本化并统一发布。它可以降低复杂应用部署和升级的维护成本。

::: details 详情
### 核心概念

Helm 常见概念包括：

- Chart：应用部署模板包。
- Values：不同环境的配置值。
- Release：一次安装后的实例。
- Template：Kubernetes YAML 模板。

同一个 Chart 可以通过不同 Values 部署到测试、预发和生产环境。

### 解决的问题

Helm 主要解决：

- 多资源统一管理。
- 环境差异配置。
- 应用版本升级。
- 回滚历史版本。
- 复用部署模板。

对包含 Deployment、Service、Ingress、ConfigMap 等多个资源的应用尤其有用。

### 注意事项

- Values 文件不要存放敏感明文。
- 模板逻辑不要过度复杂。
- 发布前要渲染模板检查最终 YAML。
- Chart 版本和应用版本要清晰区分。
- 回滚前要确认数据库变更是否兼容。
:::

## 26、Kubernetes Ingress 解决什么问题
Ingress 用于管理集群外部访问集群内部服务的 HTTP 和 HTTPS 流量。它可以基于域名、路径等规则把请求转发到不同 Service。

::: details 详情
### 和 Service 的关系

Service 负责在集群内部暴露一组 Pod。

Ingress 负责定义外部流量如何进入集群。

真正执行转发的是 Ingress Controller，例如 Nginx Ingress Controller。

### 常见能力

Ingress 常用于：

- 域名路由。
- 路径路由。
- TLS 证书终止。
- 统一入口。
- 限流和访问控制。
- 灰度流量控制。

它可以减少每个服务都单独暴露公网入口的复杂度。

### 示例

可以把不同路径转发到不同服务：

```txt
/api  -> api-service
/web  -> web-service
```

也可以按域名区分：

```txt
admin.example.com -> admin-service
www.example.com   -> web-service
```

### 注意事项

- 创建 Ingress 资源不等于自动生效，需要有对应 Controller。
- TLS 证书要关注过期和自动续签。
- 网关层配置错误会影响多个服务。
- 生产环境要监控入口延迟、错误率和连接数。
:::

## 27、蓝绿发布和滚动发布有什么区别
蓝绿发布会同时保留蓝、绿两套完整环境，通过切换流量完成版本发布。滚动发布则是在同一套环境中逐步替换实例。

::: details 详情
### 蓝绿发布

蓝绿发布通常有两套环境：

- 蓝色环境：当前线上稳定版本。
- 绿色环境：即将发布的新版本。

新版本验证通过后，一次性把流量切到绿色环境。

如果出现问题，可以快速切回蓝色环境。

### 滚动发布

滚动发布会逐批替换旧实例：

1. 启动少量新版本实例。
2. 等待健康检查通过。
3. 下线部分旧实例。
4. 重复直到全部替换完成。

它资源成本较低，但新旧版本会同时在线一段时间。

### 对比

蓝绿发布优点是切换快、回滚快。

缺点是需要两套环境，成本较高。

滚动发布优点是资源利用率更高。

缺点是发布期间要处理新旧版本兼容。

### 注意事项

- 蓝绿发布也要处理数据库兼容问题。
- 流量切换前要充分验证绿色环境。
- 切流要有监控和回滚预案。
- 有状态服务不适合简单复制两套环境后直接切换。
:::

## 28、容器镜像安全扫描要关注什么
容器镜像安全扫描用于发现镜像中的系统漏洞、依赖漏洞、敏感信息和不安全配置。它是 CI/CD 和运行时安全的重要环节。

::: details 详情
### 扫描内容

常见扫描内容包括：

- 操作系统包漏洞。
- 语言依赖漏洞。
- 镜像中泄露的密钥。
- 不必要的工具和文件。
- root 用户运行风险。
- 基础镜像版本过旧。

扫描结果通常会按严重程度分级。

### 接入位置

可以在多个阶段接入：

- 开发阶段本地扫描。
- CI 构建阶段扫描。
- 镜像推送仓库前扫描。
- 镜像仓库定期扫描。
- 部署前准入控制。

高危漏洞可以阻断发布。

### 优化方式

常见优化包括：

- 使用更小的基础镜像。
- 固定基础镜像版本。
- 及时升级依赖。
- 多阶段构建减少无关文件。
- 不把密钥写入镜像。

镜像越小，攻击面通常越小。

### 注意事项

- 扫描工具可能有误报和漏报。
- 漏洞修复要结合是否真正可利用。
- 基础镜像要有维护来源。
- 镜像构建产物要可追溯到代码版本和构建记录。
:::
