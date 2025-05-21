import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
  Inventory, 
  ShoppingCart, 
  LocalShipping, 
  TrendingUp,
  Person,
  Assignment
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Total Products', 
      value: '156', 
      icon: <Inventory />, 
      color: '#1976d2',
      description: 'Different types of aluminum products'
    },
    { 
      title: 'Pending Orders', 
      value: '23', 
      icon: <ShoppingCart />, 
      color: '#2e7d32',
      description: 'Orders waiting for processing'
    },
    { 
      title: 'Delivery Tasks', 
      value: '8', 
      icon: <LocalShipping />, 
      color: '#ed6c02',
      description: 'Pending deliveries'
    },
    { 
      title: 'Active Customers', 
      value: '45', 
      icon: <Person />, 
      color: '#9c27b0',
      description: 'Regular customers'
    },
    { 
      title: 'Monthly Sales', 
      value: '$45,678', 
      icon: <TrendingUp />, 
      color: '#d32f2f',
      description: 'Total sales this month'
    },
    { 
      title: 'Low Stock Items', 
      value: '12', 
      icon: <Assignment />, 
      color: '#7b1fa2',
      description: 'Products need restocking'
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid 
            key={stat.title}
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%'
              }
            }}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                bgcolor: stat.color,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                  {stat.title}
                </Typography>
                {stat.icon}
              </Box>
              <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {stat.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 