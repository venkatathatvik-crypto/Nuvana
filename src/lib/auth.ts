
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alex Student',
    email: 'student@nuvana.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: '2',
    name: 'Sarah Teacher',
    email: 'teacher@nuvana.com',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  }
];

export const authService = {
  async login(email: string, role: UserRole): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, we accept any password and just check email/role or return a default user
    const user = MOCK_USERS.find(u => u.email === email && u.role === role) || {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    localStorage.setItem('nuvana_user', JSON.stringify(user));
    return user;
  },

  async signup(name: string, email: string, role: UserRole): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };

    localStorage.setItem('nuvana_user', JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('nuvana_user');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('nuvana_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
