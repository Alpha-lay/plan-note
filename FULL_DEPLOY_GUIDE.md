# PlanNote 完整部署指南

## 介绍
PlanNote 是一款集任务管理、日历视图和 WeChat 通知于一体的个人规划工具。本指南将详细介绍如何将应用部署到 Vercel 并配置 WeChat 通知功能。

## 技术栈
- React 18 with TypeScript
- Vite 构建工具
- Tailwind CSS 样式
- PWA（渐进式网页应用）
- Server酱 WeChat 通知服务

## 部署前准备

### 1. 本地开发环境检查
确保以下文件存在且配置正确：

#### package.json
```json
{
  "name": "plannote",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

#### vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PlanNote - Personal Planning Assistant</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#000000" />
    <!-- PWA Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="PlanNote">
    <link rel="apple-touch-icon" href="/src/assets/icon.png">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. 应用核心功能验证
确认以下功能模块正常工作：

#### 任务管理
- 添加/编辑/删除任务
- 设置任务时间和优先级
- 时间排序显示
- WeChat 提醒开关

#### 笔记管理
- 按日期创建笔记
- 标签分类功能
- 编辑/删除笔记

#### 日历视图
- 月份导航
- 日期选择
- 显示当日任务和笔记数量

#### WeChat 通知
- Server酱集成
- 自动时间检查
- 消息发送功能

## 部署步骤

### 步骤 1: 创建 GitHub 仓库
1. 在 GitHub 上创建新仓库，例如 `plannote-app`
2. 将本地代码推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit: PlanNote application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/plannote-app.git
git push -u origin main
```

### 步骤 2: Vercel 部署
1. 访问 [https://vercel.com](https://vercel.com) 并使用 GitHub 账户登录
2. 点击 "New Project" 按钮
3. 选择 "Import Git Repository"
4. 搜索并选择你刚刚创建的 `plannote-app` 仓库
5. 点击 "Import"

#### 构建配置
在导入页面，确保以下设置正确：

- **Framework Preset**: Auto 或 Vite
- **Root Directory**: （留空）
- **Build Command**: `npm run build` 或 `yarn build`
- **Output Directory**: `dist`
- **Development Command**: `npm run dev` 或 `yarn dev`

#### 环境变量（可选）
如果需要，可以添加环境变量：

- `NODE_ENV`: production

### 步骤 3: 配置重写规则
确保项目根目录下有 `vercel.json` 文件：

```json
{
  "rewrites": [
    {"source": "/(.*)", "destination": "/"}
  ]
}
```

这确保了单页应用的路由在 Vercel 上正常工作。

### 步骤 4: 完成部署
1. 点击 "Deploy" 按钮
2. 等待构建过程完成（通常需要 1-3 分钟）
3. 部署成功后，你会获得一个类似 `https://plannote-app.vercel.app` 的 URL

## WeChat 通知配置

### 获取 Server酱 SendKey
1. 访问 [https://sct.ftqq.com](https://sct.ftqq.com)
2. 使用微信扫码关注并登录
3. 复制你的 SendKey（形如 `SCT*****` 的字符串）

### 在应用中配置
1. 打开部署好的应用
2. 在设置区域输入你的 SendKey
3. 保存设置
4. 创建带提醒的任务测试功能

## 移动端优化

### iOS 主屏幕安装
1. 使用 Safari 浏览器打开应用 URL
2. 点击底部的分享按钮
3. 选择 "添加到主屏幕"
4. 点击 "添加"

### Android 主屏幕安装
1. 打开 Chrome 浏览器访问应用
2. 点击右上角菜单
3. 选择 "添加到主屏幕"
4. 点击 "添加"

## 常见问题及解决方案

### 问题 1: 构建失败
**症状**: Vercel 部署过程中出现构建错误
**解决方法**:
1. 检查 `package.json` 中的依赖版本
2. 确认所有 TypeScript 类型错误已修复
3. 验证所有导入路径正确无误
4. 查看 Vercel 控制台中的详细错误信息

### 问题 2: PWA 功能不工作
**症状**: 无法添加到主屏幕或离线不可用
**解决方法**:
1. 确认 `public/manifest.json` 文件存在且配置正确
2. 检查 `index.html` 中的 PWA 相关 meta 标签
3. 确保部署使用 HTTPS（Vercel 自动提供）

### 问题 3: WeChat 通知不发送
**症状**: 任务时间到达但未收到 WeChat 消息
**解决方法**:
1. 验证 Server酱 SendKey 是否正确输入
2. 检查任务时间格式是否正确（HH:MM）
3. 确认 Server酱 服务状态正常
4. 检查浏览器控制台是否有错误信息

### 问题 4: 日历或任务列表不显示
**症状**: 界面加载但内容区域空白
**解决方法**:
1. 检查浏览器控制台是否有 JavaScript 错误
2. 确认 localStorage 权限未被阻止
3. 尝试清除浏览器缓存后重试

## 维护和更新

### 代码更新流程
1. 在本地修改代码
2. 测试功能正常
3. 提交到 GitHub
4. Vercel 自动检测变更并重新部署

### 数据备份
应用数据存储在浏览器的 localStorage 中，建议：
1. 定期导出重要任务和笔记数据
2. 考虑实现云端同步功能（未来扩展）

## 性能优化建议

### 加载速度
- 启用 Vercel 的自动图像优化
- 最小化第三方库依赖
- 使用代码分割按需加载

### 内存使用
- 定期清理过期任务数据
- 优化组件渲染性能
- 避免内存泄漏

## 扩展功能建议

### 未来可能的改进
1. 用户认证系统
2. 云端数据同步
3. 多设备同步
4. 高级统计报告
5. 更多通知渠道（邮件、短信等）

## 技术支持

如果遇到部署问题，请检查：

1. 所有文件是否已正确提交到 GitHub
2. `vercel.json` 配置是否正确
3. 依赖包版本是否兼容
4. TypeScript 代码是否无错误

如有其他问题，可以在 GitHub 仓库中提交 issue。