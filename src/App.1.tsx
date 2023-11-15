import React from 'react';
import logo from './logo.svg';
import DogApiSession from './api/data/DogApi';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

export function App() {

  async function debugging() {
    const test = new DogApiSession();
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={(event) => { console.log("click"); debugging(); }}>Text</button>
      </header>
    </div>
  );
}
