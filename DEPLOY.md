# PlanNote 部署指南

## 部署到 Vercel

### 步骤 1: 准备 GitHub 仓库
1. 将项目代码推送到 GitHub 仓库
2. 确保所有文件都已提交，特别是：
   - `package.json`
   - `vite.config.ts`
   - `index.html`
   - `src/` 目录
   - `public/` 目录
   - `vercel.json`

### 步骤 2: 在 Vercel 上部署
1. 访问 [https://vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 输入你的 GitHub 仓库 URL
5. 点击 "Import"
6. 在配置页面设置：
   - Framework: Vite
   - Root Directory: 保持默认
   - Environment Variables（可选）: 如有需要可添加
7. 点击 "Deploy"

### 步骤 3: 配置自定义域名（可选）
1. 在项目设置中点击 "Domains"
2. 添加你的自定义域名

### 步骤 4: 使用应用
1. 部署完成后，Vercel 会提供一个 URL
2. 你可以将此 URL 添加到手机主屏幕作为 PWA 应用
3. 在 iOS 上：使用 Safari 打开 -> 点击分享按钮 -> 添加到主屏幕

## WeChat 通知配置

### 使用 Server酱
1. 访问 [http://sc.ftqq.com](http://sc.ftqq.com)
2. 登录并获取你的 SendKey
3. 在应用中输入 SendKey 保存
4. 当任务到时间时，会自动发送 WeChat 消息提醒

### 注意事项
- 确保服务器时间与本地时间一致
- WeChat 通知依赖于 Server酱 服务的可用性
- 任务时间以 24 小时制格式输入（如 14:30）

## 故障排除

### 构建失败
- 检查 `package.json` 中的依赖项
- 确保所有导入路径正确
- 查看 Vercel 日志中的具体错误信息

### PWA 功能问题
- 确保 `public/manifest.json` 存在且配置正确
- 检查 HTTPS 是否启用（生产环境必需）

### WeChat 通知不工作
- 验证 SendKey 是否正确
- 检查任务时间是否设置在未来
- 确认 Server酱 服务状态

## 更新应用
1. 修改代码后推送到 GitHub
2. Vercel 会自动重新构建和部署