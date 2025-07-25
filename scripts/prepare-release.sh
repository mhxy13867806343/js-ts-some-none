#!/bin/bash

# 发布准备脚本
# 用于准备项目发布到 GitHub 和 npm

set -e

echo "🚀 准备发布 vue-some-none..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
    echo "❌ 错误: 需要 Node.js 16+ (当前版本: $(node -v))"
    exit 1
fi
echo "✅ Node.js 版本检查通过: $(node -v)"

# 检查是否安装了 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm 已安装: $(pnpm -v)"

# 清理
echo "🧹 清理旧文件..."
pnpm run clean

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 类型检查
echo "🔍 运行 TypeScript 类型检查..."
pnpm run type-check

# 运行测试
echo "🧪 运行测试..."
pnpm test

# 构建
echo "🔨 构建项目..."
pnpm run build

# 检查必要文件
echo "📋 检查必要文件..."
required_files=("README.md" "LICENSE" "package.json" "option.js" "option.d.ts")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 错误: 缺少必要文件 $file"
        exit 1
    fi
done
echo "✅ 所有必要文件都存在"

# 检查 Git 状态
if [ -d ".git" ]; then
    echo "📋 检查 Git 状态..."
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  警告: 有未提交的更改"
        git status --short
        echo "请先提交所有更改再发布"
    else
        echo "✅ Git 工作目录干净"
    fi
fi

# 显示包信息
echo "📦 包信息:"
echo "名称: $(node -p "require('./package.json').name")"
echo "版本: $(node -p "require('./package.json').version")"
echo "描述: $(node -p "require('./package.json').description")"

echo ""
echo "🎉 发布准备完成!"
echo ""
echo "下一步:"
echo "1. 确保所有更改已提交到 Git"
echo "2. 推送到 GitHub: git push origin main"
echo "3. 创建 GitHub 发布版本"
echo "4. 发布到 npm: pnpm publish"
echo ""
echo "GitHub 仓库: https://github.com/mhxy13867806343/js-ts-some-none"
echo "npm 包: https://www.npmjs.com/package/vue-some-none"