import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

interface UserProfileProps {
  initialUserId?: number;
}

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

// 自定义 Hook：用户管理
const useUserManager = (initialId?: number) => {
  const [user, setUser] = useState<Option<User>>(None());
  const [loading, setLoading] = useState(false);
  const [actionHistory, setActionHistory] = useState<string[]>([]);

  const addAction = useCallback((action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionHistory(prev => {
      const newHistory = [`[${timestamp}] ${action}`, ...prev];
      return newHistory.slice(0, 10); // 保持最多 10 条记录
    });
  }, []);

  const findUser = useCallback((id: number): Option<User> => {
    const foundUser = mockUsers.find(u => u.id === id);
    return foundUser ? Some(foundUser) : None();
  }, []);

  const searchUser = useCallback(async (id: number) => {
    if (!id) return;
    
    setLoading(true);
    addAction(`搜索用户 ID: ${id}`);
    
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = findUser(id);
    setUser(foundUser);
    setLoading(false);
    
    const result = foundUser.isSome() ? '找到用户' : '用户不存在';
    addAction(`搜索结果: ${result}`);
  }, [findUser, addAction]);

  const updateUserEmail = useCallback(() => {
    setUser(prevUser => 
      prevUser.map(u => ({
        ...u,
        email: `updated_${u.email}`
      }))
    );
    addAction('更新了用户邮箱');
  }, [addAction]);

  const deleteUser = useCallback(() => {
    const userName = user.map(u => u.name).unwrapOr('未知用户');
    setUser(None());
    addAction(`删除了用户: ${userName}`);
  }, [user, addAction]);

  const createUser = useCallback((id: number) => {
    const newUser: User = {
      id,
      name: `新用户${id}`,
      email: `user${id}@example.com`,
      profile: { age: 25, city: '北京' }
    };
    
    setUser(Some(newUser));
    addAction(`创建了新用户: ${newUser.name}`);
  }, [addAction]);

  // 初始化
  useEffect(() => {
    addAction('组件已挂载');
    if (initialId) {
      searchUser(initialId);
    }
  }, [initialId, searchUser, addAction]);

  return {
    user,
    loading,
    actionHistory,
    searchUser,
    updateUserEmail,
    deleteUser,
    createUser
  };
};

// 用户信息组件
const UserInfo: React.FC<{ user: Option<User> }> = ({ user }) => {
  const userEmail = useMemo(() => 
    user
      .andThen(u => u.email ? Some(u.email) : None())
      .unwrapOr('未提供邮箱'),
    [user]
  );

  const userCity = useMemo(() => 
    user
      .andThen(u => u.profile ? Some(u.profile.city) : None())
      .unwrapOr('未知城市'),
    [user]
  );

  const ageGroup = useMemo(() => 
    user
      .andThen(u => u.profile ? Some(u.profile.age) : None())
      .map(age => {
        if (age < 25) return '青年';
        if (age < 35) return '中年';
        return '中老年';
      })
      .unwrapOr('未知年龄组'),
    [user]
  );

  return user.match({
    Some: (userData) => (
      <div className="user-found">
        <h2>{userData.name}</h2>
        <p><strong>ID:</strong> {userData.id}</p>
        <p><strong>邮箱:</strong> {userEmail}</p>
        <p><strong>城市:</strong> {userCity}</p>
        <p><strong>年龄组:</strong> {ageGroup}</p>
      </div>
    ),
    None: () => (
      <div className="user-not-found">
        <p>用户未找到</p>
      </div>
    )
  });
};

// 操作按钮组件
const UserActions: React.FC<{
  user: Option<User>;
  onUpdateEmail: () => void;
  onDelete: () => void;
  onCreate: () => void;
}> = ({ user, onUpdateEmail, onDelete, onCreate }) => {
  const canUpdateEmail = user
    .map(u => u.email != null)
    .unwrapOr(false);

  return (
    <div className="user-actions">
      {user.isSome() ? (
        <>
          <button 
            onClick={onUpdateEmail}
            disabled={!canUpdateEmail}
            className="btn-update"
          >
            更新邮箱
          </button>
          <button onClick={onDelete} className="btn-delete">
            删除用户
          </button>
        </>
      ) : (
        <button onClick={onCreate} className="btn-create">
          创建新用户
        </button>
      )}
    </div>
  );
};

// 操作历史组件
const ActionHistory: React.FC<{ history: string[] }> = ({ history }) => (
  <div className="history">
    <h3>操作历史</h3>
    <ul>
      {history.map((action, index) => (
        <li key={index}>{action}</li>
      ))}
    </ul>
  </div>
);

// 主组件
const UserProfile: React.FC<UserProfileProps> = ({ initialUserId = 1 }) => {
  const [searchId, setSearchId] = useState<number>(initialUserId);
  const {
    user,
    loading,
    actionHistory,
    searchUser,
    updateUserEmail,
    deleteUser,
    createUser
  } = useUserManager(initialUserId);

  const handleSearch = useCallback(() => {
    searchUser(searchId);
  }, [searchUser, searchId]);

  const handleCreate = useCallback(() => {
    createUser(searchId);
  }, [createUser, searchId]);

  // 监听用户状态变化
  useEffect(() => {
    console.log('用户状态变化:', user.match({
      Some: (u) => `当前用户: ${u.name}`,
      None: () => '无用户'
    }));
  }, [user]);

  return (
    <div className="user-profile">
      <h1>React 16.8+ Option Type 示例</h1>
      
      {/* 用户搜索 */}
      <div className="search-section">
        <input 
          type="number" 
          value={searchId}
          onChange={(e) => setSearchId(Number(e.target.value))}
          placeholder="输入用户 ID"
        />
        <button onClick={handleSearch}>搜索用户</button>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="user-info">
          <UserInfo user={user} />
          <UserActions 
            user={user}
            onUpdateEmail={updateUserEmail}
            onDelete={deleteUser}
            onCreate={handleCreate}
          />
        </div>
      )}

      {/* 操作历史 */}
      <ActionHistory history={actionHistory} />
    </div>
  );
};

// 应用组件
const App: React.FC = () => {
  return (
    <div className="app">
      <UserProfile initialUserId={1} />
    </div>
  );
};

export default App;

// CSS 样式（可以放在单独的 CSS 文件中）
export const styles = `
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
  margin-bottom: 15px;
}

.user-found h2 {
  margin-top: 0;
  color: #333;
}

.user-found p {
  margin: 8px 0;
  color: #555;
}

.user-not-found {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.user-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.user-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-update {
  background-color: #28a745;
  color: white;
}

.btn-update:hover {
  background-color: #218838;
}

.btn-update:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-create {
  background-color: #17a2b8;
  color: white;
}

.btn-create:hover {
  background-color: #138496;
}

.history {
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
`;

// 使用示例：
// import App, { styles } from './react-example';
// 
// // 在你的应用中使用
// function MyApp() {
//   return (
//     <>
//       <style>{styles}</style>
//       <App />
//     </>
//   );
// }