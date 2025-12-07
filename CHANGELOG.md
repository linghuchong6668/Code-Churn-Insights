# Change Log

All notable changes to the "Code Churn Insights" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2025-11-19

### Added
- 🎉 首次发布
- ✨ 四象限风险分析模型（危险区、活跃区、不稳定区、稳定区）
- ✨ 基于 Git 提交历史的代码变动频率分析
- ✨ 智能 Bug 识别（支持多种关键词：fix, bug, hotfix, bugfix, 修复）
- ✨ 交互式散点图可视化（基于 ECharts）
- ✨ 详细数据表格展示（支持排序和筛选）
- ✨ 一键跳转到代码文件
- ✨ 灵活的配置选项：
  - 自定义分析时间范围
  - 自定义 Bug 关键词列表
  - 自定义忽略路径
- ✨ 中英文双语支持
- ✨ 企业级安全性（防命令注入、XSS 防护）
- ✨ 高性能优化（流式处理、异步非阻塞）
- ✨ 用户友好的进度提示

### Features
- **四象限模型**：根据变动频率和 Bug 修复频率将文件分类
- **可视化分析**：直观的散点图展示代码风险分布
- **快速定位**：点击图表或表格直接跳转到文件
- **灵活配置**：支持自定义分析参数
- **性能优化**：适用于小、中、大型项目（< 30 秒分析时间）

### Technical Highlights
- TypeScript 类型安全
- VS Code Webview API 深度集成
- ECharts 专业图表库
- Git 命令安全执行（spawn 而非 exec）
- 完善的错误处理和用户提示

---

## [Unreleased]

### Planned
- 支持导出分析报告（HTML/PDF）
- 添加趋势分析（多时间段对比）
- 支持团队协作分析
- 集成 CI/CD 工作流
- 支持更多 VCS（SVN、Mercurial）

---

### Version Format
- **MAJOR**: 重大架构变更或不兼容更新
- **MINOR**: 新功能添加
- **PATCH**: Bug 修复和小改进
