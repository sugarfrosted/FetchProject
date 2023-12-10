import '../App.css';
import {
    Box,
    Container,
} from '@mui/material';
import Authentication from '../api/auth/Authentication';
import DogGreeting from './DogGreeting';
import DogSearch from './DogSearch';
import LoginPane from './LoginPane';
import TopBar from './TopBar';
import {
    useRecoilState,
} from 'recoil';
import {
    useState,
} from 'react';
import {
    userLoginState,
} from '../state/atoms';

function DogSearchActivity() {
    const [loginPaneOpen, setLoginPaneOpen] = useState(false);
    const [loginState, setLoginState] = useRecoilState(userLoginState);

    function onLoginSuccessHandler(name: string, email: string) : void {
        setLoginState({userName: name, email: email, loginStatus: true });
    }

    function onLoginCloseHandler() {
        setLoginPaneOpen(false);
    }

    const logoutClickedHandler = async (authLookup: Authentication) => {
        await authLookup.Logout().then(() => {}, _rejection => {});
    };

    const loginClickedHandler = () => {
        setLoginPaneOpen(true);
    };

    return (
    /* eslint-disable indent */
      <Box sx={{ flexGrow: 1 }}>
        <TopBar loginClickedHandler={loginClickedHandler} logoutClickedHandler={logoutClickedHandler}/>
        <Container>
          { loginState.loginStatus ? <DogSearch /> : <DogGreeting /> }
        </Container>
        <LoginPane onSuccess={onLoginSuccessHandler} onClose={onLoginCloseHandler} open={loginPaneOpen} />
      </Box>
    /* eslint-endable indent */
    );
}

export default DogSearchActivity;