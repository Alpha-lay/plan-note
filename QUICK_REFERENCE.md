# PlanNote 快速参考卡

## 🚀 快速启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📱 部署到 Vercel
1. 推送代码到 GitHub
2. 在 Vercel 导入仓库
3. 自动部署完成

## 📝 核心功能

### 任务管理
- **添加任务**: 点击 "+" 按钮
- **设置时间**: HH:MM 格式
- **优先级**: 🔥 urgent / ☕ chill
- **提醒**: 开启 WeChat 通知

### 笔记管理
- **创建笔记**: Notes 页面点击 "+"
- **标签**: 逗号分隔多个标签
- **日期**: 自动关联到当前日期

### 日历视图
- **导航**: 左右箭头切换月份
- **选择**: 点击日期查看内容
- **提示**: 圆点表示有内容

## 🔔 WeChat 通知设置
1. 访问: https://sct.ftqq.com
2. 获取 SendKey
3. 在应用中输入并保存
4. 创建任务时开启提醒

## 📱 移动端安装
### iOS
Safari → 分享 → 添加到主屏幕

### Android
Chrome → 菜单 → 添加到主屏幕

## 🛠️ 常用命令
```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 📁 关键文件
- `src/App.tsx` - 主应用
- `src/types.ts` - 类型定义
- `src/components/` - UI 组件
- `src/hooks/useStorage.ts` - 数据存储
- `src/hooks/useReminder.ts` - 提醒系统
- `public/manifest.json` - PWA 配置
- `vercel.json` - 部署配置

## 💡 使用技巧
- 任务会按时间自动排序
- 优先级影响任务颜色
- 数据保存在浏览器本地
- 支持离线使用 PWA

## 🆘 故障排除
- **构建失败**: 检查依赖和类型错误
- **通知不工作**: 确认 SendKey 和时间格式
- **PWA 异常**: 检查 HTTPS 和 manifest.json