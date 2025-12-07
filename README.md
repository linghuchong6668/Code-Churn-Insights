# Code Churn Insights - 代码风险热力图插件

> 🚀 一键识别代码库中的高风险文件，让重构和代码审查更高效！

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://gitee.com/linghuchong6668/vscode_extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.75.0-007ACC.svg)](https://code.visualstudio.com/)

---

## ⚡ 快速开始 - 3 步上手

### 1️⃣ 安装插件

```bash
# 方式一：从 VS Code 市场安装（推荐）
在 VS Code 中搜索 "Code Churn Insights" 并安装

# 方式二：从源码安装
git clone https://gitee.com/linghuchong6668/vscode_extension.git
cd vscode_extension
npm install && npm run compile
vsce package
code --install-extension code-churn-insights-1.0.0.vsix
```

### 2️⃣ 打开 Git 项目

在 VS Code 中打开任意包含 `.git` 目录的项目

### 3️⃣ 运行分析

按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)，输入：

```
Code Churn: 分析当前仓库
```

**就这么简单！** 3-10 秒后自动生成可视化报告 📊

---

## 🎬 效果演示

### 项目介绍视频
[VsCode插件-Code Churn Insights-让你迅速定位高风险代码！](https://www.bilibili.com/video/BV1VbyEBHEcv/)

### 功能预览

**四象限风险分析图**：一目了然看到哪些文件需要关注
```
         Bug 修复频率 ↑
              │
    🟡 不稳定  │  🔴 危险
   技术债务   │  需要重构
  ─────────────┼─────────────→ 变动频率
    🔵 稳定    │  🟢 活跃
   核心代码   │  健康开发
```

**交互式报告**：
- 点击散点图直接跳转到文件
- 表格支持排序和筛选
- 实时显示文件变动统计

---

## 💡 这个插件能帮你什么？

### 🎯 代码审查
**问题**：几十个文件不知道重点审查哪些？  
**解决**：优先审查红色和黄色区域的文件 → Review 效率提升 3 倍

### 🔧 重构规划
**问题**：项目难维护，不知道从哪里重构？  
**解决**：按风险等级排序，优先重构危险文件 → 精准投入

### 📊 技术债务
**问题**：债务难量化？  
**解决**：定期分析，跟踪高风险文件数量 → 可量化可追踪

### 👥 新人入职
**问题**：不熟悉代码库？  
**解决**：看懂风险象限图，知道哪些能改哪些要谨慎 → 上手时间减半

---

## 📖 详细说明

### 工作原理

**Code Churn Insights** 通过分析 Git 提交历史，计算每个文件的：
- **变动频率**：被修改的次数
- **Bug 修复频率**：包含 `fix`、`bug`、`hotfix`、`修复` 等关键词的提交次数

然后用四象限模型可视化展示，让你快速定位：
- 🔴 **危险文件**：经常改且经常出 Bug → 立即重构
- 🟢 **活跃文件**：经常改但很少出 Bug → 开发健康
- 🟡 **不稳定文件**：不常改但一改就出 Bug → 技术债务
- 🔵 **稳定文件**：不常改也很少出 Bug → 核心代码

### 核心特点

✅ **零配置**：基于 Git 历史，无需额外设置  
✅ **零学习**：一键分析，自动生成报告  
✅ **高性能**：大型项目（1000+ 提交）< 30 秒  
✅ **交互式**：点击图表直接跳转代码  
✅ **可定制**：支持自定义时间范围、关键词、忽略路径

---

## 🌟 核心功能

### 四象限风险分析
自动将文件分类到 4 个风险区域，一眼看出问题

### 智能 Bug 识别
自动识别包含 `fix`、`bug`、`hotfix`、`修复` 等关键词的提交

### 交互式可视化
- ECharts 专业图表
- 点击散点跳转文件
- 表格支持排序筛选

### 灵活配置
```json
{
  "codeChurn.analysis.since": "90 days ago",        // 分析时间范围
  "codeChurn.analysis.bugKeywords": ["fix", "bug"], // Bug 关键词
  "codeChurn.analysis.ignorePaths": ["node_modules/**"] // 忽略路径
}
```

---

## ⚙️ 高级配置（可选）

打开 VS Code 设置（`Cmd+,`），搜索 `Code Churn`：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `codeChurn.analysis.since` | `"90 days ago"` | 分析时间范围<br>可选：`"30 days ago"`, `"1 year ago"` 等 |
| `codeChurn.analysis.bugKeywords` | `["fix", "bug", "hotfix", "修复", "bugfix"]` | Bug 识别关键词<br>可添加团队特有关键词 |
| `codeChurn.analysis.ignorePaths` | `["node_modules/**", "dist/**", "build/**"]` | 忽略的文件路径<br>支持通配符 `*` 和 `**` |

---

## 🛠️ 开发指南

### 环境要求
- Node.js >= 20.0.0
- VS Code >= 1.75.0
- Git >= 2.0.0

### 本地开发

```bash
# 1. 克隆仓库
git clone https://gitee.com/linghuchong6668/vscode_extension.git
cd vscode_extension

# 2. 安装依赖
npm install

# 3. 编译项目
npm run compile

# 4. 在 VS Code 中按 F5 启动调试
```

### 打包发布

```bash
# 安装打包工具
npm install -g @vscode/vsce

# 打包
vsce package

# 生成 code-churn-insights-1.0.0.vsix
```

---

## 📊 性能表现

| 仓库规模 | 提交数 | 文件数 | 分析时间 |
|---------|--------|--------|----------|
| 小型项目 | < 100 | < 50 | < 3 秒 |
| 中型项目 | 100-1000 | 50-200 | < 10 秒 |
| 大型项目 | > 1000 | > 200 | < 30 秒 |

---

## 🐛 常见问题

<details>
<summary><b>Q: 显示"未检测到 Git"？</b></summary>

确保已安装 Git：
```bash
git --version
```
如未安装，访问 https://git-scm.com/ 下载
</details>

<details>
<summary><b>Q: 显示"不是 Git 仓库"？</b></summary>

确保项目包含 `.git` 目录，或运行：
```bash
git init
```
</details>

<details>
<summary><b>Q: 分析结果为空？</b></summary>

可能原因：
- 时间范围内没有提交 → 增加时间范围
- 文件被忽略规则过滤 → 检查配置
</details>

<details>
<summary><b>Q: 分析速度慢？</b></summary>

优化方法：
- 缩短时间范围
- 添加更多忽略路径
- 超大型仓库考虑分批分析
</details>

---

## 🤝 贡献指南

欢迎贡献！详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

```bash
# 1. Fork 项目
# 2. 创建分支
git checkout -b feature/your-feature

# 3. 提交更改
git commit -m "feat: add amazing feature"

# 4. 推送并创建 Pull Request
git push origin feature/your-feature
```

---

## 📄 开源协议

MIT License - 详见 [LICENSE](./LICENSE)

---

## 👥 作者与支持

**Code Churn Insights Team - 大师兄**

- 📧 邮箱：dsx_5188@qq.com
- 🐛 问题反馈：[Gitee Issues](https://gitee.com/linghuchong6668/vscode_extension/issues)
- 💡 功能建议：欢迎提交 Pull Request

---

## ⭐ Star 支持

如果这个项目对你有帮助，欢迎 Star ⭐ 支持！

---

**让数据驱动你的代码质量决策！** 🚀
