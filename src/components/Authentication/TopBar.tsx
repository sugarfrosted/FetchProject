import { AccountCircle,
    Logout,
} from "@mui/icons-material";
import {
    AppBar,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    useContext,
    useEffect,
    useState,
} from "react";
import {
    AuthContext,
} from "../../state/DogContext";
import Authentication from "../../api/auth/Authentication";
import {
    useRecoilValue,
} from "recoil";
import {
    userLoginState,
} from "../../state/atoms";

/**Top bar for the application. Shows login status as well as the controls for logging in and logging out. */
export default function TopBar(props: TopBarProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const authLookup = useContext(AuthContext);
    const loginState = useRecoilValue(userLoginState);

    useEffect(() => { setIsLoggedIn(loginState.loginStatus); }, [loginState]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        if (props.loginClickedHandler) {
            props.loginClickedHandler();
        }
    };

    const handleLogout = () => {
        if (props.logoutClickedHandler && authLookup) {
            props.logoutClickedHandler(authLookup);
        }
    };

    return (
    /* eslint-disable indent */
      <AppBar position="sticky" sx={{marginBottom: "2em"}}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Dog Finder!
          </Typography>
          {
          isLoggedIn ?
          (<div>
            <Tooltip title={`Current User: ${loginState.userName}`} >
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
              <MenuItem>Name: {loginState.userName}</MenuItem>
              <MenuItem>Email: {loginState.email}</MenuItem>
            </Menu>
          </div>) :
          (<Button onClick={handleLogin} color="inherit">Login</Button>)
        }
        </Toolbar>
      </AppBar>
    /* eslint-enable indent */
    );
}

interface TopBarProps {
  loginClickedHandler?: (() => void) | undefined;
  logoutClickedHandler?: ((auth: Authentication) => void) | undefined;
}