# 🚶‍♂️ 散步 (Sanpo)

> “漫无目的地散步，也是一种生活方式。”

Sanpo 是一款极简主义的 PWA (Progressive Web App) 应用，旨在为想要散步但缺乏方向的人提供轻松有趣的指引。通过随机生成“去哪里”和“做什么”，让每一次散步都成为一场小小的探险。

## 🔗 在线体验

👉 **立即访问：[https://sanpo-one.vercel.app](https://sanpo-one.vercel.app)**

## ✨ 核心功能

*   **🎲 随机指引**：
    *   **去哪里**：随机生成一个目的地建议（如“随便走个六十分钟”、“找个公园坐坐”）。
    *   **做什么**：随机生成一个活动建议（如“吃个套餐吧”、“找找像脸的东西”）。
    *   支持分别重新生成，直到找到让你心动的建议。
*   **📂 任务组管理**：
    *   **自定义任务**：创建属于你自己的任务组，添加个性化的散步灵感。
    *   **一键切换**：在首页快速切换不同的任务组（如“周末探险”、“雨天散步”）。
*   **🤝 分享与导入**：
    *   **二维码分享**：生成任务组二维码，朋友扫一扫即可导入。
    *   **JSON 导入**：支持通过文本或扫码导入他人的任务组。
*   **📝 历史记录**：自动保存每一次生成的“地点+活动”组合，留住美好的散步回忆。
*   **📱 PWA 支持**：可安装到手机主屏幕，享受原生 App 般的体验，支持离线访问。

## 🛠️ 技术栈

*   **前端框架**：[React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **构建工具**：[Vite](https://vitejs.dev/)
*   **样式库**：[Tailwind CSS](https://tailwindcss.com/)
*   **后端服务**：[Supabase](https://supabase.com/) (Database & Auth)
*   **PWA**：[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
*   **图标**：[Lucide React](https://lucide.dev/)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/sanpo.git
cd sanpo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件，并填入您的 Supabase 配置：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可。

## 📦 部署

本项目配置了 `vercel.json`，推荐使用 [Vercel](https://vercel.com) 进行一键部署。

1.  将代码推送到 GitHub。
2.  在 Vercel 中导入项目。
3.  在 Vercel 项目设置中添加环境变量 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)。
4.  点击部署！

## 📱 如何安装到手机

### iOS (iPhone)
1. 使用 **Safari** 浏览器访问 [https://sanpo-one.vercel.app](https://sanpo-one.vercel.app)。
2. 点击底部的 **分享** 按钮（方框带箭头图标）。
3. 向下滑动，选择 **“添加到主屏幕”**。
4. 点击右上角的 **“添加”**。

### Android
1. 使用 **Chrome** 浏览器访问 [https://sanpo-one.vercel.app](https://sanpo-one.vercel.app)。
2. 点击右上角的菜单按钮（三个点）。
3. 选择 **“添加到主屏幕”** 或 **“安装应用”**。
4. 按照提示确认安装。

## 📄 许可证

MIT License
