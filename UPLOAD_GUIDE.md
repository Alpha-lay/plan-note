# PlanNote 上传指南

## 上传到 GitHub

### 1. 初始化本地仓库
```bash
# 确保你在项目根目录
cd d:\Qoder

# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "feat: PlanNote 个人规划助手 - 完整版本"
```

### 2. 创建 GitHub 仓库
1. 登录 GitHub 账户
2. 点击 "New repository" 按钮
3. 输入仓库名称（例如：plannote-app）
4. 选择 "Public" 或 "Private"
5. 不要勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 3. 连接本地仓库到 GitHub
```bash
# 添加远程仓库地址（替换 YOUR_USERNAME 和 YOUR_REPOSITORY_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

### 4. 验证上传
1. 访问你的 GitHub 仓库页面
2. 确认所有文件都已成功上传
3. 检查以下关键文件是否存在：
   - `package.json`
   - `src/` 目录
   - `public/` 目录
   - `README.md`
   - `DEPLOY.md`

## 部署到 Vercel

### 1. 注册 Vercel 账户
1. 访问 [https://vercel.com](https://vercel.com)
2. 点击 "Sign Up" 并使用 GitHub 账户登录

### 2. 导入项目
1. 点击 "New Project" 按钮
2. 选择 "Import Git Repository"
3. 从列表中选择你刚创建的 plannote-app 仓库
4. 点击 "Import"

### 3. 配置部署
Vercel 会自动检测项目类型并配置：
- 框架: Vite
- 构建命令: `npm run build`
- 输出目录: `dist`

确认配置正确后，点击 "Deploy" 按钮。

### 4. 完成部署
1. 等待构建完成（通常需要 1-3 分钟）
2. 部署完成后会显示应用 URL
3. 你可以随时访问该 URL 使用 PlanNote 应用

## 配置 WeChat 通知

### 1. 获取 Server酱 SendKey
1. 访问 [https://sct.ftqq.com](https://sct.ftqq.com)
2. 使用微信扫码关注并登录
3. 复制你的 SendKey

### 2. 在应用中配置
1. 打开部署后的应用 URL
2. 在设置区域输入你的 SendKey
3. 保存设置
4. 测试提醒功能

## 移动端使用

### iOS 设备
1. 使用 Safari 浏览器打开应用 URL
2. 点击底部分享按钮
3. 选择 "添加到主屏幕"
4. 点击 "添加" 即可像原生应用一样使用

### Android 设备
1. 使用 Chrome 浏览器打开应用 URL
2. 点击右上角菜单
3. 选择 "添加到主屏幕"
4. 点击 "添加" 即可像原生应用一样使用

## 验证部署

部署完成后，验证以下功能：
- [ ] 应用页面正常加载
- [ ] 任务管理功能正常
- [ ] 笔记管理功能正常
- [ ] 日历视图正常
- [ ] WeChat 通知配置功能正常
- [ ] PWA 安装功能正常

## 故障排除

### 部署失败
- 检查 `vercel.json` 文件是否存在
- 确认 `package.json` 中的依赖项正确
- 查看 Vercel 控制台中的错误信息

### 功能异常
- 清除浏览器缓存后重试
- 检查浏览器控制台是否有错误信息
- 确认所有文件都已正确上传到 GitHub

### WeChat 通知不工作
- 确认 SendKey 输入正确
- 检查 Server酱 服务状态
- 确认任务时间设置在未来