// Frontend-specific User type (excludes sensitive backend fields)
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  displayName: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  lastLogin?: string;
  loginCount: number;
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: string;
  };
}

// Re-export shared types
export * from './shared';

// App state types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface FormErrors {
  [key: string]: string | undefined;
}