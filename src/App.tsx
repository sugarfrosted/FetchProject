import React from 'react';
import logo from './logo.svg';
import './App.css';
import DogApiSession from './api/data/DogApi';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, TextField } from '@mui/material';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Box><TextField id="tfAuthName" label="Name"/> <TextField id="tfAuthEmail"/></Box>
    </Box>
  );
}

export default App;
