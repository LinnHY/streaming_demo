# React 流式 SSR 演示

基于 React 18 的流式服务端渲染（Streaming SSR）演示项目，展示 HTML 如何在 JavaScript 加载完成前逐步流式传输到浏览器。

## 功能特性

- **流式渲染**：使用 `renderToPipeableStream` 实现 HTML 流式输出
- **Suspense 支持**：Comments、Sidebar、Post 等组件通过 `React.lazy` 代码分割，并在服务端流式输出
- **模拟延迟**：可配置 API 请求延迟和 JS 加载延迟，用于观察流式效果
- **渐进式增强**：页面内容在 JS 加载前即可显示，提升首屏体验

## 技术栈

- React 18
- Express
- Webpack
- Babel

## 项目结构

```
streaming_demo/
├── src/
│   ├── index.js      # 客户端入口，hydrateRoot  hydration
│   ├── App.js        # 根组件，包含 Suspense 和懒加载组件
│   ├── Html.js       # HTML 壳组件
│   ├── data.js       # 数据层，模拟服务端数据获取
│   ├── Layout.js     # 布局组件
│   ├── NavBar.js     # 导航栏
│   ├── Post.js       # 文章内容（懒加载）
│   ├── Sidebar.js    # 侧边栏（懒加载）
│   ├── Comments.js   # 评论列表（懒加载，依赖数据）
│   └── Spinner.js    # 加载占位组件
├── server/
│   ├── server.js     # Express 服务
│   ├── render.js     # 流式渲染逻辑
│   └── delays.js     # 延迟配置
├── scripts/
│   └── build.js      # Webpack 构建脚本
└── build/            # 构建输出目录
```

## 快速开始

### 环境要求

- Node.js >= 14.9.0

### 安装依赖

```bash
npm install
```

### 启动开发模式

```bash
npm start
```

该命令会同时启动：
- **服务端**：Express 服务器（默认端口 4000）
- **构建器**：Webpack 监听文件变化并重新构建

访问 http://localhost:4000 查看效果。

### 生产模式

```bash
npm run start:prod
```

## 延迟配置

项目通过 `server/delays.js` 模拟网络延迟，便于观察流式渲染行为：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `API_DELAY` | 2000ms | 模拟服务端数据获取延迟 |
| `JS_BUNDLE_DELAY` | 4000ms | 模拟 JS 资源加载延迟 |
| `ABORT_DELAY` | 10000ms | 服务端等待数据超时时间，超时后中止流式渲染 |

调整这些值可以观察：
- HTML 如何在 JS 加载前逐步显示
- 评论区域如何先显示 Spinner，再流式替换为实际内容
- 代码分割的组件如何独立流式输出

## 工作原理

1. **服务端**：`renderToPipeableStream` 将 React 树渲染为可流式传输的 HTML
2. **Suspense 边界**：遇到懒加载或数据依赖时，先输出 fallback（Spinner），数据就绪后再输出实际内容
3. **客户端**：`hydrateRoot` 将流式接收的 HTML 与 React 应用进行 hydration，恢复交互能力
4. **数据同步**：服务端通过 `DataProvider` 模拟数据获取，客户端使用 `data={null}` 保持组件树一致，直接使用本地 fakeData

## License

MIT
