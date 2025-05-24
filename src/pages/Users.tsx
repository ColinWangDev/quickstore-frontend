import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  createdAt: string;
}

const roles = [
  { value: 'admin', label: '管理员' },
  { value: 'staff', label: '办公室人员' },
  { value: 'warehouse', label: '仓库人员' }
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'staff'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('获取用户列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 处理编辑用户
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      role: user.role
    });
    setOpenDialog(true);
  };

  // 处理删除用户
  const handleDelete = async (userId: number) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          setSuccessMessage('用户删除成功');
          fetchUsers();
        } else {
          setError('删除用户失败');
        }
      } catch (err) {
        setError('网络错误，请稍后重试');
      }
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMessage('用户更新成功');
        setOpenDialog(false);
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.message || '更新失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">用户管理</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户名</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>
                  {roles.find(r => r.value === user.role)?.label || user.role}
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          编辑用户
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="用户名"
              value={selectedUser?.username || ''}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="姓名"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="角色"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              margin="normal"
              required
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users; 