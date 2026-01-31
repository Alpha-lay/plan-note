# PlanNote 项目完整文件结构

## 项目根目录
```
d:\Qoder\
├── package.json                 # 项目配置与依赖
├── package-lock.json           # 锁定依赖版本
├── vite.config.ts             # Vite 构建配置
├── tsconfig.json              # TypeScript 配置
├── tsconfig.node.json         # Node.js TypeScript 配置
├── tailwind.config.ts         # Tailwind CSS 配置
├── postcss.config.js          # PostCSS 配置
├── index.html                 # HTML 入口模板
├── vercel.json                # Vercel 部署配置
├── README.md                  # 项目说明文档
├── DEPLOY.md                  # 部署指南
├── DEPLOY_CHECKLIST.md        # 部署检查清单
├── DEPLOY_INSTRUCTIONS.md     # 部署说明
├── DEPLOYMENT_PACKAGE.md      # 部署包说明
├── FULL_DEPLOY_GUIDE.md       # 完整部署指南
├── HOW_TO_DEPLOY.md           # 如何部署
├── UPLOAD_GUIDE.md            # 上传指南
├── public/                    # 静态资源目录
│   ├── manifest.json          # PWA 应用清单
│   ├── icon-192.png           # PWA 图标 (192x192)
│   └── icon-512.png           # PWA 图标 (512x512)
├── src/                       # 源代码目录
│   ├── App.tsx                # 主应用组件
│   ├── main.tsx               # 应用入口
│   ├── types.ts               # TypeScript 类型定义
│   ├── lib/
│   │   └── utils.ts           # 工具函数
│   ├── components/            # React 组件
│   │   ├── Calendar.tsx       # 日历组件
│   │   ├── TaskList.tsx       # 任务列表组件
│   │   └── NoteList.tsx       # 笔记列表组件
│   └── hooks/                 # 自定义 Hooks
│       ├── useStorage.ts      # 数据存储 Hook
│       └── useReminder.ts     # 提醒功能 Hook
├── dist/                      # 构建输出目录
│   ├── index.html             # 构建后的 HTML
│   ├── manifest.json          # 构建后的 PWA 配置
│   ├── assets/                # 构建后的静态资源
│   │   ├── index-BCEX6d8F.css # 构建后的样式文件
│   │   └── index-BhKCL3rG.js  # 构建后的 JS 文件
│   ├── icon.svg               # SVG 图标
│   └── sendkey.json           # Server酱密钥文件
└── node_modules/              # 依赖包目录
```

## 详细文件说明

### 根目录文件
- `package.json`: 定义项目元数据、依赖和脚本命令
- `vite.config.ts`: Vite 构建工具配置，包含服务器配置和插件
- `tsconfig.json`: TypeScript 编译选项配置
- `tailwind.config.ts`: Tailwind CSS 主题和插件配置
- `index.html`: HTML 模板，包含 PWA 相关 meta 标签

### public/ 目录
- `manifest.json`: PWA 应用配置，定义安装和显示选项
- `icon-*.png`: PWA 应用图标，不同尺寸用于不同场景

### src/ 目录结构
- `App.tsx`: 主应用组件，整合所有功能模块
- `types.ts`: 定义应用所需的数据类型（Task, Note, Priority 等）
- `lib/utils.ts`: 通用工具函数（ID 生成、类名合并、日期格式化）

#### components/ 目录
- `Calendar.tsx`: 日历视图组件，显示每月日期和对应任务/笔记
- `TaskList.tsx`: 任务管理组件，支持创建、编辑、删除任务
- `NoteList.tsx`: 笔记管理组件，支持按日期创建和管理笔记

#### hooks/ 目录
- `useStorage.ts`: 自定义 Hook，处理本地存储的读取和写入
- `useReminder.ts`: 自定义 Hook，处理任务提醒逻辑和 Server酱集成

### 构建相关
- `vercel.json`: 配置 Vercel 部署行为，包含重写规则
- `dist/`: 构建后的静态文件，可直接部署到任何静态服务器

## 功能模块关系图

```
App.tsx (主应用)
├── Calendar.tsx (日历视图)
│   └── 显示每日任务/笔记摘要
├── TaskList.tsx (任务列表)
│   ├── 创建/编辑/删除任务
│   ├── 设置时间/优先级
│   └── WeChat 提醒开关
├── NoteList.tsx (笔记列表)
│   ├── 按日期创建笔记
│   └── 支持标签分类
├── useStorage.ts (数据管理)
│   ├── 任务CRUD操作
│   ├── 笔记CRUD操作
│   └── 数据持久化到localStorage
└── useReminder.ts (提醒系统)
    ├── 检查即将到来的任务
    ├── 调用Server酱API
    └── 发送WeChat通知
```

## 部署流程

1. 代码提交到 GitHub 仓库
2. Vercel 自动检测并拉取代码
3. 运行 `npm run build` 构建项目
4. 部署 `dist/` 目录到 CDN
5. 生成可访问的 URL

## 技术栈

- 前端框架: React 18.2 + TypeScript 5.2.2
- 构建工具: Vite 5.0.8
- 样式框架: Tailwind CSS + PostCSS
- 图标库: Lucide React
- 日期处理: date-fns
- PWA 支持: Manifest API + Service Worker

这个结构确保了应用的模块化、可维护性和可扩展性，同时支持现代化的开发流程和部署方式。