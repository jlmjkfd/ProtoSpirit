import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type {
  LoginCredentials,
  AuthResponse,
  ApiResponse,
  User,
  Project,
} from "../types";

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
      timeout: 600000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  private clearAuth() {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete this.api.defaults.headers.common["Authorization"];
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      "/auth/login",
      credentials
    );

    if (response.data.success && response.data.data.token) {
      this.token = response.data.data.token;
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      this.setAuthHeader(this.token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed, clearing local auth anyway");
    } finally {
      this.clearAuth();
    }
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> =
      await this.api.get("/auth/me");
    return response.data;
  }

  async getUsers(): Promise<ApiResponse<{ users: User[]; stats: any }>> {
    const response: AxiosResponse<ApiResponse<{ users: User[]; stats: any }>> =
      await this.api.get("/auth/users");
    return response.data;
  }

  // Projects endpoints
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response: AxiosResponse<ApiResponse<Project[]>> =
      await this.api.get("/projects");
    return response.data;
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.api.get(
      `/projects/${id}`
    );
    return response.data;
  }

  async createProject(
    project: Partial<Project>
  ): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.api.post(
      "/projects",
      project
    );
    return response.data;
  }

  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<ApiResponse<Project>> {
    const response: AxiosResponse<ApiResponse<Project>> = await this.api.put(
      `/projects/${id}`,
      updates
    );
    return response.data;
  }

  async deleteProject(id: string): Promise<ApiResponse<{ message: string }>> {
    const response: AxiosResponse<ApiResponse<{ message: string }>> =
      await this.api.delete(`/projects/${id}`);
    return response.data;
  }

  // Requirements endpoints
  async extractRequirements(description: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post(
      "/requirements/extract",
      {
        description,
      }
    );
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.api.get("/health", {
      baseURL:
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:3001",
    });
    return response.data;
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!localStorage.getItem("user");
  }
}

export const apiService = new ApiService();
export default apiService;
