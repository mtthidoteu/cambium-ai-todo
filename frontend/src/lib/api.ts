const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  completed?: boolean;
  title?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/api/v1/tasks/');
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/api/v1/tasks/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const params = new URLSearchParams();
    if (data.completed !== undefined) {
      params.append('completed', data.completed.toString());
    }
    if (data.title !== undefined) {
      params.append('title', data.title);
    }

    return this.request<Task>(`/api/v1/tasks/${id}?${params}`, {
      method: 'PUT',
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
