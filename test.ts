/**
 * TypeScript test file for Option type
 * Run with: npm run test
 */

import { Option, Some, None, match } from './option.js';
import {
  TypeSafeUserService,
  safeArrayGet,
  safeJsonParse,
  safeParseInt,
  combineOptions,
  filterMap,
  sequenceOptions,
  User
} from './example.js';

// ===== 类型安全测试 =====

function testTypeSafety() {
  console.log('\n=== 类型安全测试 ===');
  
  // 基本类型推断
  const numberOpt = Some(42);
  const stringOpt = Some("hello");
  const noneOpt = None();
  
  // TypeScript 应该能正确推断类型
  const doubled: number = numberOpt.map(n => n * 2).unwrapOr(0);
  const uppercased: string = stringOpt.map(s => s.toUpperCase()).unwrapOr("");
  
  console.log(`Doubled: ${doubled}`);
  console.log(`Uppercased: ${uppercased}`);
  
  // 类型守卫测试
  function processOption<T>(opt: Option<T>): string {
    if (opt.isSome()) {
      // TypeScript 知道这里 opt 是 Some<T>
      return `Value: ${opt.unwrap()}`;
    } else {
      // TypeScript 知道这里 opt 是 None
      return "No value";
    }
  }
  
  console.log(processOption(Some(123)));
  console.log(processOption(None()));
}

// ===== 用户服务测试 =====

function testUserService() {
  console.log('\n=== 用户服务测试 ===');
  
  const userService = new TypeSafeUserService();
  
  // 测试用户查找
  const user1 = userService.findById(1);
  const user999 = userService.findById(999);
  
  console.log(`User 1: ${user1.map(u => u.name).unwrapOr("Not found")}`);
  console.log(`User 999: ${user999.map(u => u.name).unwrapOr("Not found")}`);
  
  // 测试嵌套属性访问
  const city1 = userService.getUserCity(1);
  const city999 = userService.getUserCity(999);
  
  console.log(`User 1 city: ${city1.unwrapOr("Unknown")}`);
  console.log(`User 999 city: ${city999.unwrapOr("Unknown")}`);
  
  // 测试用户信息组合
  const userInfo1 = userService.getUserInfo(1);
  const userInfo999 = userService.getUserInfo(999);
  
  console.log('User 1 info:', userInfo1.unwrapOr({ name: "N/A", email: "N/A", city: "N/A" }));
  console.log('User 999 info:', userInfo999.unwrapOr({ name: "N/A", email: "N/A", city: "N/A" }));
}

// ===== 实用函数测试 =====

function testUtilityFunctions() {
  console.log('\n=== 实用函数测试 ===');
  
  // 安全数组访问
  const numbers = [10, 20, 30, 40, 50];
  console.log(`Array[2]: ${safeArrayGet(numbers, 2).unwrapOr(-1)}`);
  console.log(`Array[10]: ${safeArrayGet(numbers, 10).unwrapOr(-1)}`);
  
  // 安全 JSON 解析
  const validJson = '{"name": "test", "value": 42}';
  const invalidJson = '{invalid json}';
  
  const parsed1 = safeJsonParse<{name: string, value: number}>(validJson);
  const parsed2 = safeJsonParse(invalidJson);
  
  console.log('Valid JSON:', parsed1.unwrapOr({ name: "error", value: 0 }));
  console.log('Invalid JSON:', parsed2.unwrapOr({ error: "parse failed" }));
  
  // 安全数字解析
  const validNumber = "123";
  const invalidNumber = "abc";
  
  console.log(`Parse "123": ${safeParseInt(validNumber).unwrapOr(-1)}`);
  console.log(`Parse "abc": ${safeParseInt(invalidNumber).unwrapOr(-1)}`);
  
  // 组合 Options
  const combined1 = combineOptions(Some(5), Some(10), (a: number, b: number) => a + b);
  const combined2 = combineOptions(Some(5), None(), (a: number, b: number) => a + b);
  
  console.log(`Combine Some(5) + Some(10): ${combined1.unwrapOr(0)}`);
  console.log(`Combine Some(5) + None(): ${combined2.unwrapOr(0)}`);
  
  // 过滤映射
  const strings = ["1", "2", "abc", "3", "def", "4"];
  const parsedNumbers = filterMap(strings, safeParseInt);
  console.log('Parsed numbers from strings:', parsedNumbers);
  
  // 序列化 Options
  const allSome = [Some(1), Some(2), Some(3)];
  const withNone = [Some(1), None(), Some(3)];
  
  console.log('All Some sequence:', sequenceOptions(allSome).unwrapOr([]));
  console.log('With None sequence:', sequenceOptions(withNone).unwrapOr([]));
}

// ===== 模式匹配测试 =====

function testPatternMatching() {
  console.log('\n=== 模式匹配测试 ===');
  
  function processValue<T>(opt: Option<T>): string {
    return match(opt, [
      [Some, (value: T) => {
        if (typeof value === 'string') {
          return `字符串: "${value}"`;
        } else if (typeof value === 'number') {
          return `数字: ${value}`;
        } else if (Array.isArray(value)) {
          return `数组: [${value.join(', ')}]`;
        } else if (typeof value === 'object' && value !== null) {
          return `对象: ${JSON.stringify(value)}`;
        } else {
          return `其他类型: ${value}`;
        }
      }],
      [None, () => "空值"]
    ]);
  }
  
  console.log(processValue(Some(42)));
  console.log(processValue(Some("Hello")));
  console.log(processValue(Some([1, 2, 3])));
  console.log(processValue(Some({ name: "test", value: 123 })));
  console.log(processValue(None()));
}

// ===== 链式操作测试 =====

function testChaining() {
  console.log('\n=== 链式操作测试 ===');
  
  // 复杂的链式操作
  const result = Some("  Hello World  ")
    .map(s => s.trim())
    .filter((s: string) => s.length > 0)
    .map(s => s.toLowerCase())
    .map(s => s.split(' '))
    .filter((arr: string[]) => arr.length > 1)
    .map(arr => arr.join('-'))
    .unwrapOr("processing-failed");
  
  console.log(`Chain result: ${result}`);
  
  // 数学运算链
  const mathResult = Some(10)
    .filter(n => n > 0)
    .map(n => n * 2)
    .andThen(n => n > 15 ? Some(n) : None())
    .map(n => Math.sqrt(n))
    .map(n => Math.round(n * 100) / 100)
    .unwrapOr(0);
  
  console.log(`Math chain result: ${mathResult}`);
}

// ===== 错误处理测试 =====

function testErrorHandling() {
  console.log('\n=== 错误处理测试 ===');
  
  // 模拟可能失败的操作
  function riskyOperation(input: string): Option<number> {
    if (input.length === 0) {
      return None();
    }
    
    const num = parseInt(input, 10);
    if (isNaN(num)) {
      return None();
    }
    
    if (num < 0) {
      return None();
    }
    
    return Some(num);
  }
  
  const testInputs = ["", "abc", "-5", "0", "42"];
  
  testInputs.forEach(input => {
    const result = riskyOperation(input)
      .map(n => n * 2)
      .filter(n => n > 10)
      .unwrapOr(-1);
    
    console.log(`Input: "${input}" -> Result: ${result}`);
  });
}

// ===== 性能测试 =====

function testPerformance() {
  console.log('\n=== 性能测试 ===');
  
  const iterations = 100000;
  
  // 测试 Option 创建和操作
  console.time('Option operations');
  
  for (let i = 0; i < iterations; i++) {
    const opt = Some(i)
      .map(n => n * 2)
      .filter(n => n % 2 === 0)
      .map(n => n.toString())
      .unwrapOr("");
  }
  
  console.timeEnd('Option operations');
  
  // 测试传统 null 检查
  console.time('Traditional null checks');
  
  for (let i = 0; i < iterations; i++) {
    let value: number | null = i;
    if (value !== null) {
      value = value * 2;
      if (value % 2 === 0) {
        const str = value.toString();
      }
    }
  }
  
  console.timeEnd('Traditional null checks');
}

// ===== 主测试函数 =====

function runAllTests() {
  console.log('🧪 开始 TypeScript Option 类型测试\n');
  
  try {
    testTypeSafety();
    testUserService();
    testUtilityFunctions();
    testPatternMatching();
    testChaining();
    testErrorHandling();
    testPerformance();
    
    console.log('\n✅ 所有测试完成！');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
// runAllTests(); // 取消注释以运行测试

export {
  runAllTests,
  testTypeSafety,
  testUserService,
  testUtilityFunctions,
  testPatternMatching,
  testChaining,
  testErrorHandling,
  testPerformance
};