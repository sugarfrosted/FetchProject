import { AccountCircle, Logout } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Authentication from "../api/auth/Authentication";
import { AuthContext } from "../state/DogContext";

export default function TopBar(props : topBarProps)
{
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const authLookup = useContext(AuthContext);

  useEffect(() => { setIsLoggedIn(!!props?.name && !!props?.email) }, [props?.email, props.name]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    if (props.loginClickedHandler)
    {
      props.loginClickedHandler();
    }
  }

  const handleLogout = () => {
    if (props.logoutClickedHandler && authLookup)
    {
      props.logoutClickedHandler(authLookup);
    }
  };

  return (
  <AppBar position="static" sx={{marginBottom: "2em"}}>
    <Toolbar>
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        Dog Searcher!
      </Typography>
      {
        isLoggedIn ?
        (<div>
          <Tooltip title={`Current User: ${props.name}`} >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout" >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleLogout}
              >
              <Logout />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>Name: {props.name}</MenuItem>
            <MenuItem>Email: {props.email}</MenuItem>
          </Menu>
        </div>) :
        (<Button onClick={handleLogin} color="inherit">Login</Button>)
      }
    </Toolbar>
  </AppBar>
  );
}

interface topBarProps {
  name: string | null;
  email: string | null;
  loginClickedHandler?: (() => void) | undefined;
  logoutClickedHandler?: ((auth: Authentication) => void) | undefined;
}