# PlanNote 部署包说明

## 项目概述
PlanNote 是一款集任务管理、日历视图和 WeChat 通知于一体的个人规划工具，现已完全开发完成并准备好部署。

## 包含的文件

### 源代码
- `src/App.tsx` - 主应用组件
- `src/types.ts` - TypeScript 类型定义
- `src/components/Calendar.tsx` - 日历组件
- `src/components/TaskList.tsx` - 任务列表组件
- `src/components/NoteList.tsx` - 笔记列表组件
- `src/hooks/useStorage.ts` - 数据存储 Hook
- `src/hooks/useReminder.ts` - 提醒功能 Hook
- `src/lib/utils.ts` - 工具函数

### 配置文件
- `package.json` - 项目依赖和脚本配置
- `vite.config.ts` - Vite 构建配置
- `tailwind.config.ts` - Tailwind CSS 配置
- `tsconfig.json` - TypeScript 配置
- `index.html` - HTML 模板，包含 PWA 元标签

### PWA 相关
- `public/manifest.json` - PWA 应用清单
- `public/icon-192.png` - PWA 图标 (192x192)
- `public/icon-512.png` - PWA 图标 (512x512)

### 部署配置
- `vercel.json` - Vercel 重写规则配置

### 文档
- `README.md` - 项目说明文档
- `DEPLOY.md` - 部署指南
- `FULL_DEPLOY_GUIDE.md` - 详细部署指南
- `DEPLOY_CHECKLIST.md` - 部署检查清单

### 构建产物
- `dist/` - 构建后的静态文件目录（已验证构建成功）

## 部署步骤

### 方法 1: Vercel 部署（推荐）
1. 将此项目推送至 GitHub 仓库
2. 访问 [https://vercel.com](https://vercel.com) 并连接 GitHub 账户
3. 导入项目仓库
4. Vercel 会自动检测并使用以下配置：
   - 框架: Vite
   - 构建命令: `npm run build`
   - 输出目录: `dist`
5. 部署完成后即可获得访问 URL

### 方法 2: 静态托管
1. 构建项目: `npm run build`
2. 将 `dist/` 目录中的所有文件上传至任何静态文件托管服务
3. 确保服务器配置了 SPA 路由（将所有路由重定向到 index.html）

## 功能说明

### 任务管理
- 创建、编辑、删除任务
- 设置任务时间
- 选择优先级（urgent/chill）
- 开启 WeChat 提醒功能

### 笔记管理
- 按日期创建笔记
- 支持标签分类
- 编辑和删除功能

### 日历视图
- 月份导航
- 日期选择
- 显示当日任务和笔记数量

### WeChat 通知
- 集成 Server酱 服务
- 自动在任务时间到达时发送 WeChat 消息
- 用户可自行配置 SendKey

### PWA 功能
- 可添加到主屏幕
- 离线使用能力
- 原生应用体验

## 技术特点

- React 18 with TypeScript
- 响应式设计，适配移动端和桌面端
- 使用 localStorage 进行数据持久化
- 模块化组件设计
- 类型安全
- 遵循现代前端最佳实践

## 环境要求

- Node.js >= 14.0.0
- npm 或 yarn 包管理器

## 维护说明

此应用已完全开发完成，包含完整的错误处理和用户反馈机制。代码经过优化，具有良好的性能表现。

如需更新功能，只需修改源代码并重新部署即可。应用会自动处理数据迁移和向后兼容性。