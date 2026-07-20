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

## 9、Dockerfile 中 CMD 和 ENTRYPOINT 有什么区别
`CMD` 和 `ENTRYPOINT` 都可以定义容器启动时执行的命令。区别在于 `ENTRYPOINT` 更像固定入口，`CMD` 更像默认参数或默认命令。

::: details 详情
### CMD

`CMD` 提供容器启动时的默认命令：

```dockerfile
CMD ["node", "server.js"]
```

运行容器时如果传入新命令，`CMD` 会被覆盖：

```bash
docker run app-image node worker.js
```

### ENTRYPOINT

`ENTRYPOINT` 定义更固定的入口：

```dockerfile
ENTRYPOINT ["node", "server.js"]
```

运行时传入的参数通常会追加到 `ENTRYPOINT` 后面。

适合把镜像做成一个固定命令工具。

### 配合使用

常见组合：

```dockerfile
ENTRYPOINT ["node", "server.js"]
CMD ["--port", "3000"]
```

`ENTRYPOINT` 固定执行程序，`CMD` 提供默认参数。

用户可以覆盖默认参数。

### 注意事项

- 推荐使用 exec 格式，避免信号处理问题。
- shell 格式可能影响容器接收 SIGTERM。
- 容器主进程退出后，容器也会退出。
- 需要可覆盖命令时，优先考虑 `CMD`。
:::

## 10、Dockerfile 中 COPY 和 ADD 有什么区别
`COPY` 和 `ADD` 都可以把文件复制进镜像，但 `ADD` 额外支持自动解压本地 tar 文件和从 URL 获取内容。大多数场景推荐优先使用 `COPY`。

::: details 详情
### COPY

`COPY` 语义简单，只做复制：

```dockerfile
COPY package.json pnpm-lock.yaml ./
COPY src ./src
```

它更容易理解和维护。

### ADD

`ADD` 除了复制，还支持一些额外能力：

```dockerfile
ADD app.tar.gz /app/
ADD https://example.com/file.txt /tmp/file.txt
```

本地 tar 文件会被自动解压。

URL 下载能力虽然存在，但通常不建议依赖它。

### 为什么优先 COPY

优先使用 `COPY` 的原因：

- 语义明确。
- 行为更可预测。
- 不会意外解压文件。
- 更容易审查 Dockerfile。

只有确实需要 `ADD` 的特殊能力时，再使用 `ADD`。

### 注意事项

- 复制路径受构建上下文限制。
- `.dockerignore` 会影响哪些文件能被复制。
- 不要复制无关目录，避免镜像过大。
- 远程文件建议用 `curl` 或包管理工具下载，并校验完整性。
:::

## 11、Docker 容器日志应该如何处理
Docker 容器日志通常建议输出到 stdout 和 stderr，再由 Docker、宿主机日志系统或日志采集组件统一收集。不要把日志只写在容器内部文件里。

::: details 详情
### 为什么输出到标准流

容器是临时运行单元。

如果日志只写在容器内部文件中，容器删除后日志可能丢失。

输出到 stdout/stderr 后，可以使用：

```bash
docker logs <container>
```

查看容器日志。

### 日志驱动

Docker 支持不同日志驱动，例如：

- `json-file`
- `local`
- `journald`
- `syslog`
- `fluentd`

不同日志驱动适合不同采集链路。

默认 `json-file` 如果不限制大小，可能占满磁盘。

### 生产实践

生产环境常见做法：

- 应用输出结构化日志。
- 容器输出到 stdout/stderr。
- 采集组件收集并发送到日志平台。
- 配置日志轮转。
- 对敏感字段脱敏。

### 注意事项

- 不要在日志中输出密码、Token、私钥。
- 要限制单容器日志文件大小和数量。
- 高频日志会影响性能和存储成本。
- 多行异常堆栈要保证采集系统能正确合并。
:::

## 12、docker run 和 docker exec 有什么区别
`docker run` 用于基于镜像创建并启动一个新容器，`docker exec` 用于在已经运行的容器中执行命令。一个是创建容器，一个是进入或操作现有容器。

::: details 详情
### docker run

`docker run` 会创建新容器：

```bash
docker run -d --name web -p 8080:80 nginx
```

这条命令会基于 `nginx` 镜像启动一个名为 `web` 的容器。

常见参数包括：

- `-d`：后台运行。
- `--name`：指定容器名。
- `-p`：端口映射。
- `-v`：挂载目录或 Volume。
- `-e`：设置环境变量。

### docker exec

`docker exec` 在运行中的容器里执行命令：

```bash
docker exec -it web sh
```

常用于进入容器排查问题。

容器必须处于运行状态，`exec` 才能执行。

### 常见误区

如果只是想进入已有容器，不应该再次 `docker run`。

再次 `docker run` 会创建新容器，可能导致端口冲突或数据不一致。

### 注意事项

- 生产环境进入容器排查要有权限和审计。
- 不要在容器内手工修改生产配置后不记录。
- 容器重建后，手工改动通常会丢失。
- 排查完成后要把修复沉淀到镜像或配置中。
:::

## 13、Docker 如何限制容器资源
Docker 可以限制容器使用的 CPU、内存和进程数量，避免单个容器耗尽宿主机资源。资源限制是容器稳定运行的重要保障。

::: details 详情
### 内存限制

可以使用 `--memory` 限制内存：

```bash
docker run --memory 512m nginx
```

如果容器超过内存限制，可能被 OOM Kill。

还可以配合 swap 限制，控制内存和交换空间使用。

### CPU 限制

可以使用 `--cpus` 限制 CPU：

```bash
docker run --cpus 1.5 nginx
```

也可以使用 CPU shares、cpuset 等方式做更细控制。

### 进程数限制

可以限制容器内进程数量：

```bash
docker run --pids-limit 100 app
```

这可以降低 fork bomb 等问题的影响。

### 注意事项

- 内存限制过小会导致应用频繁 OOM。
- CPU 限制过严会导致请求延迟升高。
- 资源限制要结合压测和线上监控调整。
- 容器资源限制不能替代应用自身的限流和降级。
:::

## 14、Docker 镜像和容器如何安全清理
Docker 长期使用后会积累停止的容器、未使用镜像、构建缓存和无用 Volume。清理可以释放磁盘，但要避免误删仍有价值的数据。

::: details 详情
### 查看占用

可以先查看 Docker 磁盘占用：

```bash
docker system df
```

它会展示镜像、容器、Volume 和构建缓存的占用情况。

### 常见清理命令

清理停止的容器：

```bash
docker container prune
```

清理悬空镜像：

```bash
docker image prune
```

清理构建缓存：

```bash
docker builder prune
```

清理未使用资源：

```bash
docker system prune
```

### Volume 要谨慎

Volume 可能保存数据库或业务数据。

不要随意执行会删除 Volume 的清理命令。

例如：

```bash
docker system prune --volumes
```

这个命令可能删除未被容器引用的 Volume。

### 注意事项

- 清理前先确认资源是否仍被使用。
- 生产环境不要盲目执行全量 prune。
- 重要 Volume 要有备份。
- CI 机器可以定期清理构建缓存和旧镜像。
:::

## 15、Docker 为什么建议使用非 root 用户运行容器
容器内使用非 root 用户运行应用，可以降低容器逃逸、文件误写和权限滥用带来的风险。即使应用被攻击，攻击者获得的权限也会更受限制。

::: details 详情
### 默认风险

很多基础镜像默认使用 root 用户。

如果容器内进程以 root 身份运行，一旦应用存在漏洞，攻击者可能拥有更高的容器内权限。

在挂载宿主机目录或配置过高权限时，风险会进一步放大。

### Dockerfile 配置

可以在 Dockerfile 中创建普通用户：

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

这样后续容器启动时会使用 `app` 用户运行。

如果应用需要写目录，要提前设置目录权限。

### rootless Docker

Rootless Docker 是让 Docker daemon 和容器尽量在非 root 权限下运行的模式。

它可以降低 Docker daemon 高权限带来的风险。

但 rootless 模式也可能有网络、存储和兼容性限制。

### 注意事项

- 不要为了省事给容器加 `--privileged`。
- 避免挂载 Docker socket 到业务容器。
- 只授予应用真正需要的目录写权限。
- 非 root 运行要在构建和启动阶段都测试通过。
:::

## 16、Docker 镜像标签和版本应该如何管理
Docker 镜像标签用于标识镜像版本，合理的标签管理可以避免部署到错误镜像，也方便回滚和追踪构建来源。

::: details 详情
### 常见标签

常见标签方式包括：

- `latest`
- 语义化版本，例如 `1.2.3`
- Git commit SHA
- 构建号
- 环境标签，例如 `staging`

生产环境不建议只依赖 `latest`。

### 推荐策略

更稳妥的做法是：

- 用不可变标签部署生产，例如 commit SHA。
- 用语义化版本做对外发布。
- 用 `latest` 只做开发或临时调试。
- 镜像仓库记录构建时间和源码版本。

这样回滚时能精确找到对应产物。

### 注意事项

- 同一个标签不要频繁覆盖，否则部署不可追溯。
- 镜像 tag 变化后要重新拉取，不能依赖旧缓存。
- 生产发布要同时记录镜像 digest。
- 对外说明版本时要区分应用版本和镜像版本。
:::

## 17、Docker HEALTHCHECK 指令有什么作用
`HEALTHCHECK` 用于让 Docker 定期检查容器内服务是否正常，从而判断容器是 healthy 还是 unhealthy。它适合做容器级健康判定，但不能替代业务层监控。

::: details 详情
### 基本用法

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

Docker 会周期性执行这个命令。

如果连续失败，容器状态会变成 `unhealthy`。

### 适合检查什么

健康检查通常检查：

- 应用进程是否可响应。
- 关键依赖是否可达。
- 本地关键接口是否返回正常。

不要把耗时很长的逻辑放进去。

### 和编排系统的关系

Docker HEALTHCHECK 只能标记容器健康状态。

在 Kubernetes 中，通常还会用 readinessProbe 和 livenessProbe 做更细的流量和重启控制。

### 注意事项

- 健康检查接口要轻量。
- 不要因为下游短暂故障就频繁判死。
- 失败后要有日志和指标辅助排查。
- `HEALTHCHECK` 只是信号，不一定会自动重启容器。
:::

## 18、Docker 容器如何优雅停止
Docker 容器优雅停止的关键是让主进程正确接收终止信号，完成连接关闭、任务保存和资源释放，再退出进程。

::: details 详情
### 停止流程

执行：

```bash
docker stop app
```

Docker 会先向容器主进程发送 `SIGTERM`。

如果在超时时间内没有退出，再发送 `SIGKILL` 强制结束。

### 应用要做什么

应用收到终止信号后应：

- 停止接收新请求。
- 等待正在处理的请求完成。
- 关闭数据库和消息队列连接。
- 保存必要状态。
- 正常退出进程。

这能减少请求中断和数据不一致。

### 常见问题

如果 Dockerfile 使用 shell 格式：

```dockerfile
CMD node server.js
```

信号可能先被 shell 接收，导致应用进程无法正确处理。

推荐使用 exec 格式：

```dockerfile
CMD ["node", "server.js"]
```

### 注意事项

- 容器内主进程最好是应用本身或合适的 init 进程。
- 长任务要支持中断和恢复。
- 停止超时时间要结合业务处理时长设置。
- 优雅退出逻辑要在发布和回滚流程中验证。
:::

## 19、Docker BuildKit 有什么作用
BuildKit 是 Docker 的现代构建引擎，用于提升构建性能、缓存能力和安全性。它支持更强的并行构建、缓存挂载和构建密钥处理。

::: details 详情
### 启用方式

可以通过环境变量启用：

```bash
DOCKER_BUILDKIT=1 docker build -t app .
```

现在很多 Docker 版本已经默认使用 BuildKit。

### 常见能力

BuildKit 常见能力包括：

- 并行执行可并行的构建步骤。
- 更清晰的构建输出。
- 缓存挂载。
- secret 挂载。
- SSH 转发。
- 更灵活的远程缓存。

这些能力对 CI 构建很有帮助。

### 缓存挂载

例如缓存包管理器目录：

```dockerfile
RUN --mount=type=cache,target=/root/.npm npm ci
```

这样可以减少重复下载依赖。

### 注意事项

- BuildKit 特性需要 Dockerfile 前端版本支持。
- secret 挂载不会持久写入镜像层，更适合处理构建期密钥。
- CI 中使用远程缓存要注意缓存污染和权限。
- 构建结果仍要通过扫描和测试验证。
:::

## 20、私有 Docker 镜像仓库要注意什么
私有镜像仓库用于保存企业内部镜像，控制镜像推送、拉取、扫描和分发权限。它是容器交付链路中的关键基础设施。

::: details 详情
### 核心能力

私有镜像仓库通常需要：

- 用户和权限管理。
- 镜像推送和拉取。
- 镜像标签管理。
- 漏洞扫描。
- 镜像清理策略。
- 审计日志。
- 高可用和备份。

生产系统要避免依赖单点仓库。

### 权限控制

需要区分不同角色：

- 谁可以推送镜像。
- 谁可以拉取生产镜像。
- 谁可以删除镜像。
- CI/CD 使用什么凭证。

凭证要定期轮换，并避免写入代码仓库。

### 发布链路

常见流程：

```txt
构建镜像 -> 扫描 -> 推送仓库 -> 部署系统拉取 -> 运行
```

高危漏洞或签名校验失败时，可以阻断部署。

### 注意事项

- 仓库要开启 HTTPS。
- 生产镜像要保留可回滚版本。
- 镜像清理要避免删除仍在线上使用的版本。
- 跨地域部署要考虑镜像同步和拉取速度。
:::

## 21、Docker 容器问题如何调试
Docker 容器调试要先确认容器状态、日志、启动命令、网络、挂载和资源限制，再进入容器内部进一步排查。不要一上来就重建镜像或删除容器。

::: details 详情
### 先看状态

常用命令：

```bash
docker ps -a
docker inspect <container>
docker logs <container>
docker stats
```

这些命令可以看到容器是否退出、退出码、环境变量、挂载、网络和资源使用情况。

### 进入容器

容器正在运行时可以执行：

```bash
docker exec -it <container> sh
```

进入后可以检查进程、文件、端口和配置。

如果镜像没有 shell，可以临时用调试镜像或在构建中保留必要诊断工具。

### 常见方向

常见问题包括：

- 启动命令错误。
- 环境变量缺失。
- 端口没有正确监听。
- 文件权限不对。
- Volume 挂载覆盖了镜像内文件。
- 依赖服务不可达。

### 注意事项

- 生产调试要保留日志和现场。
- 不要在容器内手工修复后忘记回写到镜像或配置。
- 调试工具会增加镜像体积和攻击面，生产镜像要克制。
- 容器退出太快时，可以临时覆盖启动命令排查。
:::
