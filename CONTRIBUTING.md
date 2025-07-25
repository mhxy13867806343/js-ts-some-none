# 贡献指南

感谢您对 Vue Some None 项目的关注！我们欢迎各种形式的贡献。

## 🚀 快速开始

### 环境要求

- Node.js 16.0.0+
- pnpm (推荐) 或 npm/yarn
- Git

### 本地开发设置

1. Fork 这个仓库
2. 克隆你的 fork

```bash
git clone https://github.com/your-username/js-ts-some-none.git
cd js-ts-some-none
```

3. 安装依赖

```bash
pnpm install
```

4. 运行测试确保一切正常

```bash
pnpm test
pnpm type-check
```

5. 启动开发服务器

```bash
pnpm dev
```

## 📝 贡献类型

### Bug 报告

如果您发现了 bug，请创建一个 issue 并包含：

- 清晰的 bug 描述
- 重现步骤
- 期望的行为
- 实际的行为
- 环境信息（Node.js 版本、浏览器等）
- 如果可能，提供最小重现示例

### 功能请求

对于新功能建议：

- 描述功能的用途和价值
- 提供使用示例
- 考虑向后兼容性
- 讨论可能的实现方案

### 代码贡献

1. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

2. **编写代码**

- 遵循现有的代码风格
- 添加适当的注释
- 确保类型安全（TypeScript）
- 编写测试用例

3. **测试**

```bash
# 运行所有测试
pnpm test

# 类型检查
pnpm type-check

# 在浏览器中测试
pnpm demo
```

4. **提交**

```bash
git add .
git commit -m "feat: add new feature" # 或 "fix: resolve issue"
```

5. **推送并创建 PR**

```bash
git push origin your-branch-name
```

然后在 GitHub 上创建 Pull Request。

## 📋 代码规范

### 代码风格

- 使用 2 空格缩进
- 使用分号
- 优先使用 `const`，然后是 `let`
- 使用有意义的变量和函数名
- 保持函数简洁，单一职责

### TypeScript 规范

- 提供完整的类型定义
- 避免使用 `any` 类型
- 使用泛型提高代码复用性
- 添加 JSDoc 注释

### 测试规范

- 为新功能编写测试
- 确保测试覆盖边界情况
- 测试名称应该清晰描述测试内容
- 保持测试独立性

## 🔄 开发流程

### 分支策略

- `main` - 主分支，包含稳定代码
- `feature/*` - 新功能分支
- `fix/*` - Bug 修复分支
- `docs/*` - 文档更新分支

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): description

[optional body]

[optional footer]
```

类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(option): add flatMap method

fix(types): resolve generic type inference issue

docs: update README with React examples
```

## 🧪 测试指南

### 运行测试

```bash
# 运行 TypeScript 测试
pnpm test

# 类型检查
pnpm type-check

# 浏览器测试
open test.html
```

### 编写测试

测试应该覆盖：
- 正常情况
- 边界情况
- 错误情况
- 类型安全性

## 📚 文档贡献

### README 更新

- 保持示例代码的准确性
- 添加新功能的使用示例
- 确保链接有效

### 代码注释

- 为公共 API 添加 JSDoc 注释
- 解释复杂的逻辑
- 提供使用示例

## 🎯 发布流程

维护者负责发布新版本：

1. 更新版本号
2. 更新 CHANGELOG
3. 创建 Git tag
4. 发布到 npm

## 💬 社区

### 获取帮助

- 创建 GitHub Issue
- 查看现有的 Issues 和 Discussions

### 行为准则

- 保持友善和尊重
- 欢迎新贡献者
- 提供建设性的反馈
- 遵循开源社区最佳实践

## 📄 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。

---

再次感谢您的贡献！🎉