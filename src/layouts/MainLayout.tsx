import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Products', icon: <InventoryIcon />, path: '/products' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { text: 'Inbound', icon: <LocalShippingIcon />, path: '/inbound' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Delivery', icon: <LocalShippingIcon />, path: '/delivery' },
  { text: 'Users', icon: <PersonIcon />, path: '/users' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
    handleMenuClose();
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setSuccessMessage('Password changed successfully');
        handlePasswordDialogClose();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error, please try again');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          QuickStore
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handlePasswordDialogOpen}>
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout; 