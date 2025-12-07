# 贡献指南

感谢你对 Code Churn Insights 项目的关注！我们欢迎任何形式的贡献。

## 📋 贡献方式

### 1. 报告 Bug

如果你发现了 Bug，请：

1. 在 [Issues](https://gitee.com/yourusername/code-churn-insights/issues) 中搜索是否已有相关问题
2. 如果没有，创建新 Issue，并提供：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（OS、VS Code 版本、Node.js 版本）
   - 截图或错误日志（如有）

### 2. 提出功能建议

如果你有新功能的想法：

1. 创建新 Issue，标题以 `[Feature Request]` 开头
2. 详细描述：
   - 功能的使用场景
   - 为什么需要这个功能
   - 你期望的实现方式

### 3. 提交代码

#### 开发环境设置

```bash
# 1. Fork 项目到你的 Gitee 账号

# 2. 克隆你的 Fork
git clone https://gitee.com/yourusername/code-churn-insights.git
cd code-churn-insights

# 3. 添加上游仓库
git remote add upstream https://gitee.com/original/code-churn-insights.git

# 4. 安装依赖（需要 Node.js >= 20）
npm install

# 5. 编译项目
npm run compile

# 6. 启动监听模式（自动编译）
npm run watch
```

#### 开发流程

```bash
# 1. 同步最新代码
git fetch upstream
git checkout main
git merge upstream/main

# 2. 创建特性分支
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bugfix-name

# 3. 进行开发
# 在 VS Code 中按 F5 启动调试

# 4. 提交更改
git add .
git commit -m "feat: your feature description"
# 或
git commit -m "fix: your bugfix description"

# 5. 推送到你的 Fork
git push origin feature/your-feature-name

# 6. 在 Gitee 上创建 Pull Request
```

#### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>: <subject>

<body>

<footer>
```

**Type 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修复 Bug）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

**示例**：

```bash
feat: 添加导出 PDF 报告功能

- 实现 PDF 生成逻辑
- 添加导出按钮
- 更新文档

Closes #123
```

#### 代码规范

- 使用 TypeScript 编写代码
- 遵循项目的 ESLint 配置
- 变量和函数使用有意义的命名
- 添加必要的注释
- 保持代码简洁清晰

```bash
# 运行 Lint 检查
npm run lint
```

#### Pull Request 规范

1. **标题清晰**：简洁描述 PR 的目的
2. **描述详细**：说明做了什么、为什么这样做
3. **关联 Issue**：在描述中使用 `Closes #issue_number`
4. **保持专注**：一个 PR 只做一件事
5. **测试充分**：确保功能正常、没有引入新 Bug
6. **文档更新**：如果涉及新功能，更新相关文档

## 🧪 测试

### 手动测试

```bash
# 1. 按 F5 启动调试
# 2. 在新窗口中打开测试项目
# 3. 运行命令测试功能
# 4. 检查各种场景和边界情况
```

### 测试清单

- [ ] 正常场景测试
- [ ] 边界情况测试（空仓库、超大仓库）
- [ ] 错误处理（无 Git、非 Git 仓库）
- [ ] 配置项测试（各种配置组合）
- [ ] UI 交互测试（点击、排序、筛选）
- [ ] 性能测试（大量文件、长时间范围）

## 📝 文档

### 更新文档

如果你的更改涉及：
- 新功能 → 更新 README.md
- 配置项 → 更新配置说明
- API 变更 → 更新相关文档
- Bug 修复 → 更新 CHANGELOG.md

### 文档规范

- 使用简洁清晰的语言
- 提供代码示例
- 添加截图说明（如有必要）
- 中英文对照（优先中文）

## 🎯 优先级

我们优先考虑以下类型的贡献：

1. **Bug 修复**：修复现有功能的问题
2. **性能优化**：提升插件性能和用户体验
3. **文档完善**：改进文档质量
4. **新功能**：经过充分讨论的新特性

## ⚠️ 注意事项

### 代码质量

- 不要提交未测试的代码
- 不要提交调试代码（console.log、debugger）
- 不要提交大文件或敏感信息
- 不要破坏现有功能

### 兼容性

- 保持向后兼容
- 考虑不同操作系统（Mac、Windows、Linux）
- 考虑不同 VS Code 版本
- 考虑不同 Git 版本

### 性能

- 避免阻塞 UI 线程
- 处理大量数据时使用流式处理
- 合理使用缓存
- 避免不必要的计算

## 🤝 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 尊重不同的观点和经验
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员保持同理心

### 不可接受的行为

- 使用性暗示的语言或图像
- 人身攻击或侮辱性评论
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

### 责任

项目维护者有权利和责任删除、编辑或拒绝不符合行为准则的评论、提交、代码、问题等。

## 📞 联系方式

如有任何问题，欢迎通过以下方式联系：

- **Gitee Issues**：https://gitee.com/yourusername/code-churn-insights/issues
- **邮箱**：dsx_5188@qq.com

## 🙏 致谢

感谢每一位贡献者的付出！你们的贡献让这个项目变得更好。

---

**Happy Coding!** 🚀
