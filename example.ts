/**
 * TypeScript examples for Rust-like Option type
 * This file demonstrates type-safe usage of Option in TypeScript
 */

import { Option, Some, None, match, OptionUtils } from './option.js';

// ===== 基本类型安全示例 =====

// 类型推断示例
const numberOption: Option<number> = Some(42);
const stringOption: Option<string> = Some("Hello TypeScript");
const noneOption: Option<string> = None();

// 编译时类型检查
function processNumber(opt: Option<number>): string {
  return opt
    .map(n => n * 2)  // TypeScript 知道 n 是 number 类型
    .map(n => n.toString())  // TypeScript 知道 n 是 number 类型
    .unwrapOr("No number");  // 返回 string
}

// ===== 接口和类型定义 =====

interface User {
  id: number;
  name: string;
  email?: string;
  profile?: {
    age: number;
    city: string;
  };
}

interface UserRepository {
  findById(id: number): Option<User>;
  findByEmail(email: string): Option<User>;
  save(user: User): Option<User>;
}

// ===== 实际应用示例 =====

class TypeSafeUserService implements UserRepository {
  private users: User[] = [
    { 
      id: 1, 
      name: "张三", 
      email: "zhangsan@example.com",
      profile: { age: 25, city: "北京" }
    },
    { 
      id: 2, 
      name: "李四", 
      email: "lisi@example.com",
      profile: { age: 30, city: "上海" }
    }
  ];

  findById(id: number): Option<User> {
    const user = this.users.find(u => u.id === id);
    return user ? Some(user) : None();
  }

  findByEmail(email: string): Option<User> {
    const user = this.users.find(u => u.email === email);
    return user ? Some(user) : None();
  }

  save(user: User): Option<User> {
    // 模拟保存操作
    if (user.name && user.name.length > 0) {
      this.users.push(user);
      return Some(user);
    }
    return None();
  }

  // 类型安全的用户信息获取
  getUserDisplayName(id: number): string {
    return this.findById(id)
      .map(user => user.name)
      .unwrapOr("未知用户");
  }

  // 安全的嵌套属性访问
  getUserCity(id: number): Option<string> {
    return this.findById(id)
      .andThen(user => user.profile ? Some(user.profile) : None())
      .map(profile => profile.city);
  }

  // 组合多个 Option 操作
  getUserInfo(id: number): Option<{name: string, email: string, city: string}> {
    return this.findById(id)
      .andThen(user => {
        if (!user.email || !user.profile) {
          return None();
        }
        return Some({
          name: user.name,
          email: user.email,
          city: user.profile.city
        });
      });
  }
}

// ===== 泛型函数示例 =====

// 安全的数组访问
function safeArrayGet<T>(array: T[], index: number): Option<T> {
  if (index >= 0 && index < array.length) {
    const value = array[index];
    return value !== undefined ? Some(value) : None();
  }
  return None();
}

// 安全的对象属性访问
function safePropertyGet<T, K extends keyof T>(obj: T, key: K): Option<NonNullable<T[K]>> {
  const value = obj[key];
  return value !== undefined && value !== null ? Some(value as NonNullable<T[K]>) : None();
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

// 安全的数字解析
function safeParseInt(str: string): Option<number> {
  const num = parseInt(str, 10);
  return isNaN(num) ? None() : Some(num);
}

// ===== 高级类型操作 =====

// 条件类型示例
type ExtractOptionType<T> = T extends Option<infer U> ? U : never;

// 使用示例
type NumberType = ExtractOptionType<Option<number>>; // number
type StringType = ExtractOptionType<Option<string>>; // string

// 映射类型示例
type OptionFields<T> = {
  [K in keyof T]: Option<T[K]>;
};

type OptionalUser = OptionFields<User>;
// 结果: { id: Option<number>, name: Option<string>, email: Option<string | undefined>, ... }

// ===== 实用工具函数 =====

// 组合多个 Option
function combineOptions<T, U, V>(
  opt1: Option<T>,
  opt2: Option<U>,
  combiner: (a: T, b: U) => V
): Option<V> {
  return opt1.andThen(a => 
    opt2.map(b => combiner(a, b))
  );
}

// 过滤并转换
function filterMap<T, U>(
  array: T[],
  mapper: (item: T) => Option<U>
): U[] {
  const results: U[] = [];
  for (const item of array) {
    const mapped = mapper(item);
    if (mapped.isSome()) {
      results.push(mapped.unwrap());
    }
  }
  return results;
}

// 序列化 Option 数组
function sequenceOptions<T>(options: Option<T>[]): Option<T[]> {
  const results: T[] = [];
  for (const option of options) {
    if (option.isNone()) {
      return None();
    }
    results.push(option.unwrap());
  }
  return Some(results);
}

// ===== 模式匹配示例 =====

function processUserOption(userOpt: Option<User>): string {
  return match(userOpt, [
    [Some, (user: User) => `用户: ${user.name} (${user.email || '无邮箱'})`],
    [None, () => "用户不存在"]
  ]);
}

// 复杂模式匹配
function processAnyOption<T>(opt: Option<T>): string {
  return match(opt, [
    [Some, (value: T) => {
      if (typeof value === 'string') {
        return `字符串: ${value}`;
      } else if (typeof value === 'number') {
        return `数字: ${value}`;
      } else if (Array.isArray(value)) {
        return `数组长度: ${value.length}`;
      } else {
        return `对象: ${JSON.stringify(value)}`;
      }
    }],
    [None, () => "空值"]
  ]);
}

// ===== 异步操作示例 =====

// 异步 Option 操作
async function fetchUserAsync(id: number): Promise<Option<User>> {
  try {
    // 模拟 API 调用
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      const user = await response.json();
      return Some(user);
    }
    return None();
  } catch {
    return None();
  }
}

// 链式异步操作
async function getUserEmailAsync(id: number): Promise<string> {
  const userOpt = await fetchUserAsync(id);
  return userOpt
    .map(user => user.email || "")
    .filter((email: string) => email.length > 0)
    .unwrapOr("无邮箱");
}

// ===== 使用示例 =====

function runExamples() {
  const userService = new TypeSafeUserService();
  
  // 基本使用
  console.log(userService.getUserDisplayName(1)); // "张三"
  console.log(userService.getUserDisplayName(999)); // "未知用户"
  
  // 嵌套属性访问
  const cityOpt = userService.getUserCity(1);
  console.log(cityOpt.unwrapOr("未知城市")); // "北京"
  
  // 安全数组访问
  const numbers = [1, 2, 3, 4, 5];
  console.log(safeArrayGet(numbers, 2).unwrapOr(0)); // 3
  console.log(safeArrayGet(numbers, 10).unwrapOr(0)); // 0
  
  // 安全 JSON 解析
  const validJson = '{"name": "test"}';
  const invalidJson = '{invalid json}';
  
  console.log(safeJsonParse(validJson).unwrapOr({})); // {name: "test"}
  console.log(safeJsonParse(invalidJson).unwrapOr({})); // {}
  
  // 组合操作
  const result = combineOptions(
    Some(5),
    Some(10),
    (a, b) => a + b
  );
  console.log(result.unwrapOr(0)); // 15
  
  // 过滤映射
  const strings = ["1", "2", "abc", "3"];
  const numbers2 = filterMap(strings, safeParseInt);
  console.log(numbers2); // [1, 2, 3]
}

// 导出示例函数
export {
  TypeSafeUserService,
  safeArrayGet,
  safePropertyGet,
  safeJsonParse,
  safeParseInt,
  combineOptions,
  filterMap,
  sequenceOptions,
  processUserOption,
  processAnyOption,
  fetchUserAsync,
  getUserEmailAsync,
  runExamples
};

// 类型导出
export type {
  User,
  UserRepository,
  ExtractOptionType,
  OptionFields,
  OptionalUser
};