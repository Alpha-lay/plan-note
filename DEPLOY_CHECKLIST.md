# PlanNote 部署检查清单

## 部署前检查

### 1. 代码完整性检查
- [x] 所有源代码文件已提交
- [x] `package.json` 依赖项正确
- [x] `vite.config.ts` 配置正确
- [x] `index.html` 包含 PWA 元标签
- [x] `public/manifest.json` 配置正确
- [x] `public/icon-192.png` 和 `public/icon-512.png` 存在
- [x] `vercel.json` 重写规则配置正确

### 2. 功能测试
- [x] 任务管理功能正常
- [x] 笔记管理功能正常
- [x] 日历视图功能正常
- [x] 时间调度功能正常
- [x] WeChat 通知配置功能正常
- [x] 优先级显示正常（🔥 urgent, ☕ chill）
- [x] 任务按时间排序正常
- [x] 数据持久化正常（localStorage）

### 3. 移动端兼容性
- [x] 响应式设计适配移动设备
- [x] PWA 功能正常（manifest.json, service worker）
- [x] 触摸操作友好
- [x] 字体大小适合移动端阅读

### 4. 构建测试
- [x] `npm run build` 成功执行
- [x] 构建产物在 `dist/` 目录中
- [x] 构建产物包含所有必要文件
- [ ] 在本地预览 `dist/` 目录内容正常运行

## GitHub 仓库准备
- [ ] 创建新的 GitHub 仓库
- [ ] 将本地代码推送到 GitHub
- [ ] 确认所有文件都已正确上传

## Vercel 部署
- [ ] 登录 Vercel 账户
- [ ] 导入 GitHub 仓库
- [ ] 确认构建命令为 `npm run build`
- [ ] 确认输出目录为 `dist`
- [ ] 部署完成并获得 URL

## 功能验证（部署后）
- [ ] 访问部署后的 URL
- [ ] 测试任务创建和编辑功能
- [ ] 测试笔记创建和编辑功能
- [ ] 测试日历导航功能
- [ ] 验证 WeChat 通知配置功能
- [ ] 测试 PWA 安装功能（添加到主屏幕）

## WeChat 通知配置
- [ ] 获取 Server酱 SendKey
- [ ] 在应用中配置 SendKey
- [ ] 测试任务提醒功能

## 文档完整性
- [x] DEPLOY.md 部署说明已创建
- [x] FULL_DEPLOY_GUIDE.md 详细部署指南已创建
- [x] 所有必要的部署文件已准备就绪

## 最终检查
- [ ] 应用在桌面端正常工作
- [ ] 应用在移动端正常工作
- [ ] PWA 功能正常（离线使用、主屏幕安装）
- [ ] WeChat 通知功能正常
- [ ] 所有错误处理机制正常工作