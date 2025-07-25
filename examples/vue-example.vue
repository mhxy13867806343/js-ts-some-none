<template>
  <div class="user-profile">
    <h1>Vue 3.2+ Option Type 示例</h1>
    
    <!-- 用户搜索 -->
    <div class="search-section">
      <input 
        v-model="searchId" 
        type="number" 
        placeholder="输入用户 ID"
        @input="searchUser"
      />
      <button @click="searchUser">搜索用户</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 用户信息显示 -->
    <div v-else class="user-info">
      <div v-if="user.isSome()" class="user-found">
        <h2>{{ user.unwrap().name }}</h2>
        <p><strong>ID:</strong> {{ user.unwrap().id }}</p>
        <p><strong>邮箱:</strong> {{ getUserEmail() }}</p>
        <p><strong>城市:</strong> {{ getUserCity() }}</p>
        <p><strong>年龄组:</strong> {{ getAgeGroup() }}</p>
        
        <!-- 用户操作 -->
        <div class="user-actions">
          <button @click="updateUserEmail" :disabled="!canUpdateEmail()">
            更新邮箱
          </button>
          <button @click="deleteUser">
            删除用户
          </button>
        </div>
      </div>
      
      <div v-else class="user-not-found">
        <p>用户未找到</p>
        <button @click="createUser">创建新用户</button>
      </div>
    </div>

    <!-- 操作历史 -->
    <div class="history">
      <h3>操作历史</h3>
      <ul>
        <li v-for="(action, index) in actionHistory" :key="index">
          {{ action }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Option, Some, None } from '../option';

// 类型定义
interface User {
  id: number;
  name: string;
  email?: string;
  profile?: {
    age: number;
    city: string;
  };
}

// 响应式状态
const searchId = ref<number>(1);
const user = ref<Option<User>>(None());
const loading = ref(false);
const actionHistory = ref<string[]>([]);

// 模拟用户数据
const mockUsers: User[] = [
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
  },
  {
    id: 3,
    name: "王五",
    profile: { age: 35, city: "广州" }
  }
];

// 计算属性
const getUserEmail = computed(() => {
  return user.value
    .andThen(u => u.email ? Some(u.email) : None())
    .unwrapOr('未提供邮箱');
});

const getUserCity = computed(() => {
  return user.value
    .andThen(u => u.profile ? Some(u.profile.city) : None())
    .unwrapOr('未知城市');
});

const getAgeGroup = computed(() => {
  return user.value
    .andThen(u => u.profile ? Some(u.profile.age) : None())
    .map(age => {
      if (age < 25) return '青年';
      if (age < 35) return '中年';
      return '中老年';
    })
    .unwrapOr('未知年龄组');
});

const canUpdateEmail = computed(() => {
  return user.value
    .map(u => u.email != null)
    .unwrapOr(false);
});

// 方法
const findUser = (id: number): Option<User> => {
  const foundUser = mockUsers.find(u => u.id === id);
  return foundUser ? Some(foundUser) : None();
};

const searchUser = async () => {
  if (!searchId.value) return;
  
  loading.value = true;
  addAction(`搜索用户 ID: ${searchId.value}`);
  
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 500));
  
  user.value = findUser(searchId.value);
  loading.value = false;
  
  const result = user.value.isSome() ? '找到用户' : '用户不存在';
  addAction(`搜索结果: ${result}`);
};

const updateUserEmail = () => {
  user.value = user.value.map(u => ({
    ...u,
    email: `updated_${u.email}`
  }));
  addAction('更新了用户邮箱');
};

const deleteUser = () => {
  const userName = user.value.map(u => u.name).unwrapOr('未知用户');
  user.value = None();
  addAction(`删除了用户: ${userName}`);
};

const createUser = () => {
  const newUser: User = {
    id: searchId.value,
    name: `新用户${searchId.value}`,
    email: `user${searchId.value}@example.com`,
    profile: { age: 25, city: '北京' }
  };
  
  user.value = Some(newUser);
  addAction(`创建了新用户: ${newUser.name}`);
};

const addAction = (action: string) => {
  const timestamp = new Date().toLocaleTimeString();
  actionHistory.value.unshift(`[${timestamp}] ${action}`);
  
  // 保持历史记录不超过 10 条
  if (actionHistory.value.length > 10) {
    actionHistory.value = actionHistory.value.slice(0, 10);
  }
};

// 监听器
watch(user, (newUser) => {
  console.log('用户状态变化:', newUser.match({
    Some: (u) => `当前用户: ${u.name}`,
    None: () => '无用户'
  }));
});

// 生命周期
onMounted(() => {
  addAction('组件已挂载');
  searchUser();
});
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.search-section {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-section input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-section button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.search-section button:hover {
  background-color: #0056b3;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.user-found {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.user-found h2 {
  margin-top: 0;
  color: #333;
}

.user-found p {
  margin: 8px 0;
  color: #555;
}

.user-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.user-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.user-actions button:first-child {
  background-color: #28a745;
  color: white;
}

.user-actions button:first-child:hover {
  background-color: #218838;
}

.user-actions button:first-child:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.user-actions button:last-child {
  background-color: #dc3545;
  color: white;
}

.user-actions button:last-child:hover {
  background-color: #c82333;
}

.user-not-found {
  text-align: center;
  padding: 40px;
  color: #666;
}

.user-not-found button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-not-found button:hover {
  background-color: #138496;
}

.history {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.history h3 {
  margin-top: 0;
  color: #333;
}

.history ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history li {
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #555;
}

.history li:last-child {
  border-bottom: none;
}
</style>