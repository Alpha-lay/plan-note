# PlanNote - 个人规划助手

PlanNote 是一款集任务管理、日历视图和 WeChat 通知于一体的个人规划工具。帮助你高效管理日常任务和笔记，支持时间提醒功能并通过 WeChat 发送通知。

## 功能特性

- 🗓️ **日历视图** - 直观的日历界面，查看每日任务和笔记
- ✅ **任务管理** - 创建、编辑、标记完成任务
- 📝 **笔记记录** - 按日期组织的笔记系统
- ⏰ **时间提醒** - 任务时间到达时自动提醒
- 📱 **WeChat 通知** - 通过 Server酱发送 WeChat 消息提醒
- 🎨 **优先级标识** - 用 🔥 (urgent) 和 ☕ (chill) 区分任务优先级
- 🔄 **数据持久化** - 使用 localStorage 保存数据
- 📱 **PWA 支持** - 可安装到主屏幕，离线使用

## 技术栈

- React 18 with TypeScript
- Vite 构建工具
- Tailwind CSS 样式
- date-fns 日期处理
- Lucide React 图标库

## 快速开始

### 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将在 `dist/` 目录中生成。

## 部署

此应用已配置为可在 Vercel 上一键部署。详情请参阅 `DEPLOY.md` 和 `FULL_DEPLOY_GUIDE.md`。

## WeChat 通知配置

1. 访问 [Server酱官网](https://sct.ftqq.com/)
2. 关注公众号并获取 SendKey
3. 在应用中输入 SendKey 并保存
4. 创建任务时开启提醒功能，到时间会收到 WeChat 消息

## 使用说明

### 任务管理
- 点击 "+" 添加新任务
- 设置任务标题、时间、优先级
- 选择是否需要 WeChat 提醒
- 点击任务左侧复选框标记完成
- 任务会按时间顺序排列

### 笔记管理
- 切换到笔记视图
- 点击 "+" 添加笔记
- 可为笔记添加标签
- 笔记按日期组织

### 日历导航
- 使用左右箭头切换月份
- 点击特定日期查看当天任务和笔记
- 日期旁的圆点表示该日有任务或笔记

## 文件结构

```
src/
├── components/      # React 组件
│   ├── Calendar.tsx
│   └── TaskList.tsx
├── hooks/           # 自定义 Hooks
│   ├── useStorage.ts
│   └── useReminder.ts
├── types.ts         # TypeScript 类型定义
├── lib/utils.ts     # 工具函数
└── App.tsx          # 主应用组件
public/
├── manifest.json    # PWA 配置
├── icon-192.png     # PWA 图标
└── icon-512.png     # PWA 图标
```

## PWA 功能

此应用支持 PWA 功能，在移动设备上可以通过浏览器菜单添加到主屏幕，获得原生应用般的体验。

## License

MIT