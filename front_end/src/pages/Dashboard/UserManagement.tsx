import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Users, UserCheck, UserX, Mail, Phone, Calendar, Lock, Unlock, Trash2, Plus, Shield, Edit, ArrowUpDown } from 'lucide-react';
import { userService, User, CreateUserRequest, UpdateUserRequest } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: ''
  });
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        sortBy,
        sortOrder
      });
      
      // Kiểm tra xem response có tồn tại không
      if (response) {
        setUsers(response.users || []);
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
          setTotalUsers(response.pagination.total || 0);
        } else {
          // Nếu không có pagination, sử dụng giá trị mặc định
          setTotalPages(1);
          setTotalUsers(response.users ? response.users.length : 0);
        }
      } else {
        // Nếu response là null hoặc undefined
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Lỗi tải danh sách người dùng');
      showToast('Không thể tải danh sách người dùng', 'error');
      // Đặt giá trị mặc định khi có lỗi
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddAdmin = async () => {
    if (!newAdminData.username || !newAdminData.email || !newAdminData.password) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      const adminData: CreateUserRequest = {
        username: newAdminData.username,
        email: newAdminData.email,
        password: newAdminData.password,
        role: 'admin'
      };

      const newAdmin = await userService.createUser(adminData);
      showToast('Tài khoản admin đã được tạo thành công', 'success');
      
      // Close form and reset data
      setShowAddAdminForm(false);
      setNewAdminData({
        username: '',
        email: '',
        password: ''
      });
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể tạo tài khoản admin', 'error');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserData({
      username: user.username,
      email: user.email
    });
    setShowEditUserForm(true);
  };

  const handleUpdateUser = async () => {
    if (!editUserData.username || !editUserData.email) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      const userData: UpdateUserRequest = {
        username: editUserData.username,
        email: editUserData.email
      };

      const updatedUser = await userService.updateUserInfo(selectedUser._id, userData);
      showToast('Thông tin người dùng đã được cập nhật', 'success');
      
      // Close form and reset data
      setShowEditUserForm(false);
      setSelectedUser(null);
      setEditUserData({
        username: '',
        email: ''
      });
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật thông tin người dùng', 'error');
    }
  };

  const handleLockUser = async (userId, isLocked) => {
    try {
      if (isLocked) {
        await userService.unlockUser(userId);
        showToast('Tài khoản đã được mở khóa', 'success');
      } else {
        await userService.lockUser(userId);
        showToast('Tài khoản đã bị khóa', 'success');
      }
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isLocked: !isLocked } : user
      ));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái người dùng', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      showToast('Người dùng đã được xóa', 'success');
      
      // Update local state
      setUsers(prev => prev.filter(user => user._id !== userId));
      // Also update total count
      setTotalUsers(prev => Math.max(0, prev - 1));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể xóa người dùng', 'error');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const updatedUser = await userService.updateUserRole(userId, { role: 'admin' });
      showToast('Người dùng đã được cấp quyền admin', 'success');
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: updatedUser.role } : user
      ));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật vai trò người dùng', 'error');
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      const updatedUser = await userService.updateUserRole(userId, { role: 'user' });
      showToast('Quyền admin đã được thu hồi', 'success');
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: updatedUser.role } : user
      ));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật vai trò người dùng', 'error');
    }
  };

  const getStatusBadge = (isLocked) => {
    if (isLocked) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Bị khóa
      </Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
      <Unlock className="h-3 w-3" />
      Hoạt động
    </Badge>;
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <Badge variant="default" className="bg-blue-100 text-blue-800 flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Admin
      </Badge>;
    }
    return <Badge variant="secondary" className="flex items-center gap-1">
        <UserCheck className="h-3 w-3" />
        Người dùng
      </Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? '↑' : '↓';
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              className="" 
              variant="default" 
              size="default"
              onClick={fetchUsers}
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
        <p className="text-gray-600">Quản lý thông tin, vai trò và trạng thái người dùng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => !u.isLocked).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bị khóa</CardTitle>
            <Lock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.isLocked).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm & Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="unlocked">Hoạt động</SelectItem>
                <SelectItem value="locked">Bị khóa</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full md:w-auto" 
              variant="default" 
              size="default"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
          <div className="mt-4">
            <Button 
              className="" 
              variant="default" 
              size="default"
              onClick={() => setShowAddAdminForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài khoản admin
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Admin Form */}
      {showAddAdminForm && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm tài khoản admin mới</CardTitle>
            <CardDescription>
              Điền thông tin để tạo tài khoản admin mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                <Input
                  placeholder="Nhập tên đăng nhập"
                  value={newAdminData.username}
                  onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                size="default"
                className=""
                onClick={() => {
                  setShowAddAdminForm(false);
                  setNewAdminData({
                    username: '',
                    email: '',
                    password: ''
                  });
                }}
              >
                Hủy
              </Button>
              <Button 
                variant="default" 
                size="default"
                className=""
                onClick={handleAddAdmin}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm admin
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Form */}
      {showEditUserForm && (
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa thông tin người dùng</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin của {selectedUser?.username}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                <Input
                  placeholder="Nhập tên đăng nhập"
                  value={editUserData.username}
                  onChange={(e) => setEditUserData({...editUserData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                size="default"
                className=""
                onClick={() => {
                  setShowEditUserForm(false);
                  setSelectedUser(null);
                  setEditUserData({
                    username: '',
                    email: ''
                  });
                }}
              >
                Hủy
              </Button>
              <Button 
                variant="default" 
                size="default"
                className=""
                onClick={handleUpdateUser}
              >
                <Edit className="h-4 w-4 mr-2" />
                Cập nhật
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Quản lý thông tin, vai trò và trạng thái của tất cả người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách người dùng...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('username')}>
                      <div className="flex items-center">
                        Người dùng
                        <span className="ml-2">{getSortIcon('username')}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                      <div className="flex items-center">
                        Vai trò
                        <span className="ml-2">{getSortIcon('role')}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('isLocked')}>
                      <div className="flex items-center">
                        Trạng thái
                        <span className="ml-2">{getSortIcon('isLocked')}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                      <div className="flex items-center">
                        Ngày tham gia
                        <span className="ml-2">{getSortIcon('createdAt')}</span>
                      </div>
                    </TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.isLocked)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className=""
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                            {user.role === 'user' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className=""
                                onClick={() => handleMakeAdmin(user._id)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Cấp admin
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className=""
                                onClick={() => handleRemoveAdmin(user._id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Thu hồi admin
                              </Button>
                            )}
                            
                            {user.isLocked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className=""
                                onClick={() => handleLockUser(user._id, user.isLocked)}
                              >
                                <Unlock className="h-4 w-4 mr-1" />
                                Mở khóa
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className=""
                                onClick={() => handleLockUser(user._id, user.isLocked)}
                              >
                                <Lock className="h-4 w-4 mr-1" />
                                Khóa
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              className=""
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    className=""
                    variant="outline"
                    size="default"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <span className="flex items-center px-4">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    className=""
                    variant="outline"
                    size="default"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}