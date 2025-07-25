# Vue Some None - Rust-like Option Type for JavaScript/TypeScript

🦀 一个受 Rust 启发的 Option 类型实现，为 JavaScript 和 TypeScript 提供安全的空值处理。

## ✨ 特性

- 🔒 **类型安全** - 完整的 TypeScript 支持，编译时捕获空值错误
- 🎯 **零依赖** - 轻量级实现，无外部依赖
- 🌐 **跨框架** - 支持 Vue 3.2+、React 16.8+ 及原生 JavaScript
- 🚀 **现代化** - ES6+ 语法，支持链式调用和函数式编程
- 📦 **易集成** - 支持 CommonJS 和 ES Modules
- 🛡️ **生产就绪** - 完整的测试覆盖和类型定义

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm (推荐)
pnpm add vue-some-none

# 或使用 npm
npm install vue-some-none

# 或使用 yarn
yarn add vue-some-none
```

### 基础用法

```javascript
import { Some, None, Option } from 'vue-some-none';

// 创建 Option 值
const someValue = Some(42);
const noneValue = None();

// 安全的值处理
const result = someValue
  .map(x => x * 2)
  .filter(x => x > 50)
  .unwrapOr(0);

console.log(result); // 84
```

### TypeScript 支持

```typescript
import { Option, Some, None } from 'vue-some-none';

// 类型安全的用户查找
interface User {
  id: number;
  name: string;
  email?: string;
}

function findUser(id: number): Option<User> {
  const user = users.find(u => u.id === id);
  return user ? Some(user) : None();
}

// 链式操作，完整的类型推断
const userEmail = findUser(1)
  .andThen(user => user.email ? Some(user.email) : None())
  .map(email => email.toLowerCase())
  .unwrapOr('no-email@example.com');
```

## 🎯 框架集成

### Vue 3.2+ 集成

```vue
<template>
  <div>
    <div v-if="user.isSome()">
      <h1>{{ user.unwrap().name }}</h1>
      <p>{{ getUserEmail() }}</p>
    </div>
    <div v-else>
      <p>用户未找到</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Option, Some, None } from 'vue-some-none';
import type { User } from './types';

const user = ref<Option<User>>(None());

const getUserEmail = computed(() => {
  return user.value
    .andThen(u => u.email ? Some(u.email) : None())
    .unwrapOr('无邮箱');
});

// 异步加载用户
async function loadUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      const userData = await response.json();
      user.value = Some(userData);
    } else {
      user.value = None();
    }
  } catch {
    user.value = None();
  }
}
</script>
```

### React 16.8+ 集成

```tsx
import React, { useState, useEffect } from 'react';
import { Option, Some, None } from 'vue-some-none';

interface User {
  id: number;
  name: string;
  email?: string;
}

const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<Option<User>>(None());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(Some(userData));
        } else {
          setUser(None());
        }
      } catch {
        setUser(None());
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>加载中...</div>;

  return user.match({
    Some: (userData) => (
      <div>
        <h1>{userData.name}</h1>
        <p>邮箱: {userData.email || '未提供'}</p>
      </div>
    ),
    None: () => <div>用户未找到</div>
  });
};

export default UserProfile;
```

## 📚 API 文档

### Option<T>

核心的 Option 类型，表示一个可能存在或不存在的值。

#### 创建方法

```typescript
// 创建包含值的 Some
const some = Some(42);
const someString = Some("hello");

// 创建空的 None
const none = None();

// 从可能为空的值创建
const option = Option.fromNullable(possiblyNullValue);
```

#### 核心方法

| 方法 | 描述 | 示例 |
|------|------|------|
| `isSome()` | 检查是否包含值 | `some.isSome() // true` |
| `isNone()` | 检查是否为空 | `none.isNone() // true` |
| `unwrap()` | 获取值（如果为空则抛出异常） | `some.unwrap() // 42` |
| `unwrapOr(default)` | 获取值或返回默认值 | `none.unwrapOr(0) // 0` |
| `map(fn)` | 转换包含的值 | `some.map(x => x * 2) // Some(84)` |
| `andThen(fn)` | 链式操作 | `some.andThen(x => Some(x.toString()))` |
| `filter(predicate)` | 过滤值 | `some.filter(x => x > 0) // Some(42)` |
| `orElse(fn)` | 提供备选 Option | `none.orElse(() => Some(0))` |

#### 模式匹配

```typescript
const result = option.match({
  Some: (value) => `值是: ${value}`,
  None: () => '没有值'
});
```

### 实用函数

```typescript
// 安全的数组访问
function safeGet<T>(array: T[], index: number): Option<T> {
  return index >= 0 && index < array.length 
    ? Some(array[index]) 
    : None();
}

// 安全的属性访问
function safeProp<T, K extends keyof T>(
  obj: T, 
  key: K
): Option<NonNullable<T[K]>> {
  const value = obj[key];
  return value != null ? Some(value) : None();
}

// 安全的 JSON 解析
function safeJsonParse<T = any>(jsonString: string): Option<T> {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed != null ? Some(parsed) : None();
  } catch {
    return None();
  }
}
```

## 🔧 环境要求

### 服务器环境
- **Node.js**: 16.0.0+
- **Vue**: 3.2.0+ (如果在 Vue 项目中使用)
- **React**: 16.8.0+ (如果在 React 项目中使用)
- **TypeScript**: 4.5.0+ (可选，但推荐)

### 浏览器环境
- **Chrome**: 90+ (2021年4月)
- **Firefox**: 88+ (2021年4月)
- **Safari**: 14+ (2020年9月)
- **Edge**: 90+ (2021年4月)
- **所需特性**: ES2020 模块、可选链操作符、空值合并操作符

### 纯 HTML 浏览器使用

#### 现代浏览器 (推荐)

使用 ES 模块语法，需要通过 HTTP 服务器访问：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Option Type 示例</title>
</head>
<body>
    <script type="module">
        import { Some, None } from './option.js';
        
        const user = Some({ name: '张三', age: 25 });
        console.log(user.map(u => u.name).unwrapOr('未知'));
        
        // 异步示例
        async function fetchUser(id) {
            // 模拟 API 调用
            const users = { 1: { name: '李四' } };
            return users[id] ? Some(users[id]) : None();
        }
        
        const result = await fetchUser(1);
        console.log(result.unwrapOr('用户不存在'));
    </script>
</body>
</html>
```

#### 传统浏览器兼容

使用全局变量方式：

```html
<!DOCTYPE html>
<html>
<head>
    <script src="./option.js"></script>
</head>
<body>
    <script>
        const user = Some({ name: '张三', age: 25 });
        console.log(user.map(u => u.name).unwrapOr('未知'));
    </script>
</body>
</html>
```

#### 完整浏览器示例

查看 `browser-example.html` 获取完整的浏览器使用示例，包含：
- 浏览器兼容性检查
- 交互式演示
- 错误处理示例
- 异步操作示例

```bash
# 启动本地服务器查看示例
python3 -m http.server 8080
# 然后访问 http://localhost:8080/browser-example.html
```

## 📦 包管理器支持

推荐使用 **pnpm** 进行包管理：

```bash
# 安装 pnpm
npm install -g pnpm

# 在项目中使用
pnpm add vue-some-none
pnpm add -D typescript @types/node
```

也支持其他包管理器：
- npm 7.0.0+
- yarn 1.22.0+
- yarn 3.0.0+ (Berry)

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/mhxy13867806343/js-ts-some-none.git
cd js-ts-some-none

# 安装依赖
pnpm install

# 运行测试
pnpm test

# 类型检查
pnpm type-check

# 构建
pnpm build
```

## 🧪 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
pnpm test

# 运行 TypeScript 类型检查
pnpm type-check

# 在浏览器中查看示例
pnpm dev
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

## 🔗 相关链接

- [GitHub 仓库](https://github.com/mhxy13867806343/js-ts-some-none)
- [npm 包](https://www.npmjs.com/package/vue-some-none)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vue.js 官网](https://vuejs.org/)
- [React 官网](https://reactjs.org/)

---

**Made with ❤️ for safer JavaScript/TypeScript development**