---
lang: zh-CN
title: AI
description: AI面试题
---

# AI

## 1、如何实现 ChatGPT 类应用的流式输出
::: details 详情
**什么是流式输出**
- 流式输出是指服务端不是等大模型完整生成答案后一次性返回，而是边生成边把内容片段返回给前端。
- 前端收到每个片段后立即追加到页面上，用户可以更快看到响应过程，体验上类似 ChatGPT 的逐字输出。
- 在实现上，常见方式有 `SSE`、`Fetch Stream` 和 `WebSocket`，其中问答类单向输出场景通常优先考虑 `SSE` 或 `Fetch Stream`。

---

**为什么需要流式输出**
- 降低首屏等待时间：模型完整回答可能需要几秒甚至更久，流式输出可以让用户更早看到内容。
- 提升交互体验：用户可以在回答生成过程中判断是否需要中断、重试或继续追问。
- 减少前端假死感：长时间无响应容易让用户误以为请求失败。

---

**整体流程**
- 用户在前端输入问题，点击发送。
- 前端把问题发送到自己的后端接口，而不是直接请求大模型服务。
- 后端携带安全保存的 API Key 调用大模型，并开启流式响应。
- 后端将模型返回的内容片段转发给前端。
- 前端持续读取响应流，把每个片段追加到当前回答中。
- 流结束后，前端关闭 loading 状态，并保存本轮对话。

---

**为什么不建议前端直接调用大模型接口**
- API Key 会暴露在浏览器中，任何人都可以通过开发者工具获取。
- 无法统一做权限校验、频率限制和成本控制。
- 不方便做内容安全、日志记录、错误兜底和敏感信息过滤。
- 生产环境一般通过后端接口代理大模型请求。

---

**前端实现示例**
```js
let currentController = null;

async function sendMessage(question) {
  currentController?.abort();
  currentController = new AbortController();

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
    signal: currentController.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("请求失败");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let answer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    answer += chunk;
    renderAnswer(answer);
  }
}

function renderAnswer(answer) {
  console.log("当前回答：", answer);
}

function stopGenerate() {
  currentController?.abort();
}
```

---

**后端实现示例**
```js
import express from "express";

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { question } = req.body;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const chunks = [
      "这是",
      "一个",
      "流式",
      "输出",
      "示例。",
    ];

    for (const chunk of chunks) {
      res.write(chunk);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    res.end();
  } catch (error) {
    res.write("服务异常，请稍后重试");
    res.end();
  }
});

app.listen(3000);
```

---

**SSE 和 WebSocket 如何选择**
- `SSE`
  > - 适合服务端向客户端单向推送，例如 AI 回答流、通知流。
  > - 基于 HTTP，浏览器原生支持 `EventSource`，实现简单。
  > - 默认支持断线重连，但只支持文本数据。
- `WebSocket`
  > - 适合双向实时通信，例如协同编辑、实时聊天、语音对话。
  > - 需要维护连接状态，服务端实现成本更高。
  > - 如果只是 AI 回答流，通常不需要优先使用 WebSocket。
- `Fetch Stream`
  > - 适合通过 `fetch` 读取响应体流，便于和普通 POST 请求、鉴权请求结合。
  > - 可以配合 `AbortController` 实现中断生成。

---

**需要注意的问题**
- 中断生成：使用 `AbortController` 取消当前请求，避免用户重复提问导致多个回答同时写入。
- 竞态问题：每次请求生成唯一 `requestId`，只渲染当前会话的最新响应。
- 错误处理：区分网络错误、接口错误、模型超时和用户主动取消。
- Markdown 渲染：模型返回内容如果要渲染成 HTML，需要防止 XSS。
- 成本控制：限制输入长度、对话轮数和用户请求频率。
- 敏感信息：不要把 API Key、内部接口、用户隐私直接暴露给模型或前端。

---

**总结**

实现 ChatGPT 类流式输出的核心是：前端通过 `fetch` 或 `SSE` 接收服务端持续返回的内容片段，后端负责安全调用大模型并转发流数据。前端需要重点处理流读取、状态追加、中断生成、异常兜底和 Markdown 安全渲染；后端需要重点处理 API Key 保护、鉴权、限流、日志和成本控制。
:::

## 2、说说你对 RAG 的理解
::: details 详情
`RAG` 全称是 `Retrieval Augmented Generation`，中文通常叫 **检索增强生成**。它的核心思想是：先从业务知识库中检索出和用户问题相关的内容，再把这些内容连同用户问题一起交给大模型生成答案。

---

**为什么需要 RAG**
- 大模型本身不一定知道企业内部知识，例如业务文档、接口说明、客服知识库和私有数据。
- 大模型的知识有时间限制，不能保证掌握最新信息。
- 如果只依赖模型自身回答，容易出现幻觉，生成看似合理但不准确的内容。
- 通过 RAG 可以把回答限制在可检索的资料范围内，提升准确性和可追溯性。

---

**RAG 的核心流程**
- 文档准备
  > - 收集业务文档，例如 Markdown、PDF、网页、数据库记录等。
  > - 清洗无用内容，去掉重复文本、导航栏、广告和格式噪声。
- 文档切分
  > - 将长文档拆成较小的文本片段，避免一次放入过多内容。
  > - 切分时需要保留标题、段落和上下文，避免片段失去语义。
- 向量化
  > - 使用 Embedding 模型把文本片段转换成向量。
  > - 向量可以理解为文本语义的数字表示，语义越接近，向量距离越近。
- 存储
  > - 将文本片段、向量和元信息存入向量数据库。
  > - 元信息通常包括文档标题、来源链接、更新时间和权限标识。
- 检索
  > - 用户提问时，先把问题也转换成向量。
  > - 在向量数据库中查找语义最相近的文本片段。
- 生成
  > - 把检索结果作为上下文，连同用户问题一起传给大模型。
  > - 要求模型基于上下文回答，不知道时明确说明无法从资料中找到答案。

---

**简单示例**
```js
async function answerWithRag(question) {
  const questionVector = await createEmbedding(question);
  const docs = await searchSimilarDocs(questionVector, 3);

  const context = docs
    .map((doc, index) => `资料${index + 1}：${doc.content}`)
    .join("\n\n");

  const prompt = `
请根据下面的资料回答用户问题。
如果资料中没有答案，请回答“资料中未找到相关信息”。

${context}

用户问题：${question}
`;

  return chat(prompt);
}
```

---

**前端在 RAG 场景中通常负责什么**
- 提供问题输入、历史会话和流式回答展示。
- 展示引用来源，例如答案来自哪篇文档、哪个段落或哪个链接。
- 处理文件上传、知识库选择、检索范围筛选等交互。
- 对回答中的 Markdown、代码块和链接做安全渲染。
- 在回答不准确时提供反馈入口，帮助后续优化知识库和检索策略。

---

**如何减少 RAG 的错误回答**
- 提升文档质量：保证知识库内容准确、结构清晰、及时更新。
- 合理切分文档：片段过短容易丢上下文，片段过长会引入无关信息。
- 控制召回数量：召回太少可能缺信息，召回太多会干扰模型判断。
- 增加重排序：先召回一批候选文档，再按相关性重新排序。
- 限制回答范围：Prompt 中明确要求只基于资料回答。
- 展示引用来源：方便用户检查答案依据，降低盲目信任风险。

---

**RAG 和微调的区别**
- `RAG`
  > - 更适合知识经常变化、需要引用来源、需要接入私有文档的场景。
  > - 更新知识库相对简单，通常不需要重新训练模型。
- `微调`
  > - 更适合固定任务风格、固定输出格式或特定领域表达习惯的优化。
  > - 不适合频繁更新事实知识，成本和维护复杂度更高。

---

**总结**

RAG 的本质是“先检索，再生成”。它不直接改变大模型本身，而是通过外部知识库给模型补充上下文。实际落地时，重点不只是调用模型，还包括文档清洗、文本切分、向量检索、权限控制、引用展示和效果评估。
:::
