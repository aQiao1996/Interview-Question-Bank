# Docker

这里用于整理 Docker 和容器镜像相关面试题，后续按镜像、容器、Dockerfile、多阶段构建、缓存、Volume、Network、Compose、镜像安全、运行时权限等方向追加。

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

## 2、Docker 多阶段构建有什么作用
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

## 3、容器镜像安全应该关注什么
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

## 4、容器镜像安全扫描要关注什么
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

## 5、Dockerfile 构建缓存如何优化
Dockerfile 构建缓存优化的核心是让变化少的步骤尽量放在前面，变化频繁的业务代码尽量放在后面。这样可以复用已有镜像层，减少重复安装依赖和构建时间。

::: details 详情
### 缓存规则

Docker 构建镜像时会按 Dockerfile 指令从上到下匹配缓存。

如果某一层缓存失效，它后面的层通常也会重新构建。

所以指令顺序会直接影响构建速度。

### 常见优化

Node 项目中常见写法：

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
```

这样只有业务代码变化时，不会重复安装依赖。

如果先 `COPY . .` 再安装依赖，任意代码变化都可能让依赖安装层失效。

### .dockerignore

`.dockerignore` 用于排除不需要进入构建上下文的文件，例如：

```txt
node_modules
dist
.git
.env
```

构建上下文越小，上传给 Docker daemon 的内容越少，构建也更稳定。

### 注意事项

- 锁文件要一起复制，保证依赖版本可复现。
- 不要把 `.env`、私钥、Token 放进构建上下文。
- 频繁变化的文件不要放在 Dockerfile 前面的层。
- CI 中可以配合远程缓存或 BuildKit 提升构建速度。
:::

## 6、Docker Volume 和 bind mount 有什么区别
Docker Volume 和 bind mount 都可以把数据挂载到容器中，但管理方式不同。Volume 由 Docker 管理，bind mount 直接挂载宿主机路径。

::: details 详情
### Volume

Volume 由 Docker 创建和管理。

常见命令：

```bash
docker volume create app-data
docker run -v app-data:/var/lib/mysql mysql
```

它适合数据库数据、应用持久化数据等不希望随容器删除而丢失的内容。

### bind mount

bind mount 直接使用宿主机目录：

```bash
docker run -v $(pwd):/app node:20
```

它适合本地开发，把源码目录挂进容器中实时调试。

### 主要区别

- Volume 更便于 Docker 统一管理。
- bind mount 依赖宿主机具体路径。
- Volume 更适合生产持久化。
- bind mount 更适合开发调试。

### 注意事项

- 容器删除不等于 Volume 自动删除。
- bind mount 路径权限不对会导致容器读写失败。
- 不要把宿主机敏感目录随意挂进容器。
- 生产环境要有 Volume 备份和恢复方案。
:::

## 7、Docker 常见网络模式有哪些
Docker 网络模式决定容器如何和宿主机、其他容器以及外部网络通信。常见模式包括 bridge、host、none 和自定义网络。

::: details 详情
### bridge

bridge 是默认网络模式。

容器会连接到 Docker 创建的虚拟网桥，通过 NAT 访问外部网络。

常见用法：

```bash
docker run -p 8080:80 nginx
```

这里把宿主机 `8080` 端口映射到容器 `80` 端口。

### host

host 模式让容器直接使用宿主机网络栈。

优点是网络开销更低。

缺点是隔离性更弱，端口也会和宿主机直接冲突。

### none

none 模式表示容器没有默认网络。

它适合极少数需要手动配置网络或完全隔离网络的场景。

### 自定义网络

推荐多个容器互相通信时使用自定义 bridge 网络：

```bash
docker network create app-net
docker run --network app-net --name api api-image
docker run --network app-net --name web web-image
```

同一网络内可以通过容器名访问。

### 注意事项

- 端口映射只影响宿主机访问容器，不影响容器间通信。
- 生产环境要限制不必要的端口暴露。
- 容器名解析通常依赖自定义网络。
- host 模式要谨慎使用，避免破坏隔离边界。
:::

## 8、Docker Compose 适合什么场景
Docker Compose 用于用一个 YAML 文件编排多个容器，适合本地开发、测试环境和轻量级部署。它可以统一描述服务、网络、Volume 和环境变量。

::: details 详情
### 基本示例

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"

  redis:
    image: redis:7-alpine
```

启动命令：

```bash
docker compose up -d
```

Compose 会创建服务、网络，并按配置启动容器。

### 适合场景

Docker Compose 常用于：

- 本地开发环境。
- 前后端联调。
- 集成测试依赖。
- 单机部署小型应用。
- 快速启动数据库、缓存、消息队列。

它能降低新成员搭建环境的成本。

### 和 Kubernetes 的区别

Compose 更偏单机和开发体验。

Kubernetes 更适合集群调度、弹性扩缩容、服务发现和生产级编排。

复杂生产环境通常不会只依赖 Compose。

### 注意事项

- 不要把生产密钥明文写进 compose 文件。
- 本地端口映射要避免冲突。
- 数据库服务要配置 Volume 持久化。
- `depends_on` 只表示启动顺序，不代表服务已经可用。
:::
