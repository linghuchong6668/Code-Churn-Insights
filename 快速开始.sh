#!/bin/bash

echo "🚀 Code Churn Insights - 快速开始脚本"
echo "======================================"
echo ""

# 检查 Node.js 版本
echo "📌 1. 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo "💡 请先安装 Node.js >= 20: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ 错误：需要 Node.js >= 20，当前版本：$(node -v)"
    echo "💡 使用 nvm 切换版本："
    echo "   nvm install 20"
    echo "   nvm use 20"
    exit 1
fi
echo "✅ Node.js 版本：$(node -v)"
echo ""

# 检查 Git
echo "📌 2. 检查 Git..."
if ! command -v git &> /dev/null; then
    echo "❌ 错误：未检测到 Git"
    echo "💡 请先安装 Git: https://git-scm.com/"
    exit 1
fi
echo "✅ Git 版本：$(git --version)"
echo ""

# 安装依赖
echo "📌 3. 安装依赖..."
if [ ! -d "node_modules" ]; then
    echo "   正在安装 npm 包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "   依赖已存在，跳过安装"
fi
echo "✅ 依赖安装完成"
echo ""

# 编译项目
echo "📌 4. 编译项目..."
npm run compile
if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi
echo "✅ 编译完成"
echo ""

# 打包插件
echo "📌 5. 打包插件..."
if ! command -v vsce &> /dev/null; then
    echo "   vsce 未安装，正在安装..."
    npm install -g @vscode/vsce
    if [ $? -ne 0 ]; then
        echo "❌ vsce 安装失败"
        exit 1
    fi
fi

vsce package
if [ $? -ne 0 ]; then
    echo "❌ 打包失败"
    exit 1
fi
echo "✅ 打包完成"
echo ""

# 完成
echo "🎉 全部完成！"
echo ""
echo "📦 生成的安装包："
ls -lh *.vsix 2>/dev/null || echo "   未找到 .vsix 文件"
echo ""
echo "📖 下一步："
echo "   1. 安装插件："
echo "      code --install-extension code-churn-insights-1.0.0.vsix"
echo ""
echo "   2. 或在 VS Code 中调试："
echo "      按 F5 启动扩展开发主机"
echo ""
echo "   3. 使用插件："
echo "      打开任意 Git 仓库"
echo "      Cmd+Shift+P → Code Churn: 分析当前仓库"
echo ""
echo "📚 更多信息："
echo "   - README.md: 项目文档"
echo "   - CONTRIBUTING.md: 贡献指南"
echo "   - CHANGELOG.md: 版本历史"
echo ""
echo "Happy Coding! 🚀"
