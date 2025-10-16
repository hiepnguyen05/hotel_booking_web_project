import { apiClient } from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface UpdateUserRequest {
  username: string;
  email: string;
}

export interface UpdateUserRoleRequest {
  role: 'user' | 'admin';
}

export interface UpdateUserStatusRequest {
  isLocked: boolean;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetUsersResponse {
  users: User[];
  pagination: UserPagination;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UserService {
  // Lấy danh sách tất cả người dùng với hỗ trợ phân trang và sắp xếp
  async getAllUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = 'all',
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const urlParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(role !== 'all' && { role }),
      ...(status !== 'all' && { status })
    });
    
    const response = await apiClient.get<GetUsersResponse>(`/admin/users?${urlParams.toString()}`);
    return response;
  }

  // Tạo người dùng mới
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/admin/users', userData);
    return response;
  }

  // Cập nhật thông tin người dùng
  async updateUserInfo(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${userId}`, userData);
    return response;
  }

  // Cập nhật vai trò người dùng
  async updateUserRole(userId: string, roleData: UpdateUserRoleRequest): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${userId}/role`, roleData);
    return response;
  }

  // Khóa người dùng
  async lockUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(`/admin/users/${userId}/lock`);
    return response;
  }

  // Mở khóa người dùng
  async unlockUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(`/admin/users/${userId}/unlock`);
    return response;
  }

  // Xóa người dùng
  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/admin/users/${userId}`);
    return response;
  }
}

export const userService = new UserService();