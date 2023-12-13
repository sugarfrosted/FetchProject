import '../App.css';
import {
    Box,
    Container,
} from '@mui/material';
import {
    useCallback,
    useContext,
    useState,
} from 'react';
import Authentication from '../api/auth/Authentication';
import DogGreeting from './DogGreeting';
import DogSearch from './DogSearch';
import {
    ErrorContext,
} from '../state/DogContext';
import LoginPane from './Authentication/LoginPane';
import TopBar from './Authentication/TopBar';
import {
    useRecoilState,
} from 'recoil';
import {
    userLoginState,
} from '../state/atoms';

/** The dog search activity. This shows both the placeholder and actual functional website.
 *  This exists in order to give the whole application to context and recoil atoms.
 *  This assumes that a containing layer has the following contexts defined:
 * - DogLookupContext
 * - Authentication
 * - ErrorHandler
 * - RecoilRoot
 */
function DogSearchActivity() {
    const [loginPaneOpen, setLoginPaneOpen] = useState(false);
    const [loginState, setLoginState] = useRecoilState(userLoginState);
    const errorContext = useContext(ErrorContext);
    const errorCallback = useCallback(() => { setLoginState( {userName: null, email: null, loginStatus: false} );}, [setLoginState]);

    function onLoginSuccessHandler(name: string, email: string) : void {
        setLoginState({userName: name, email: email, loginStatus: true });
    }

    function onLoginCloseHandler() {
        setLoginPaneOpen(false);
    }

    const logoutClickedHandler = async (authLookup: Authentication) => {
        await authLookup.Logout().catch(_error => errorContext.HandleError(_error, errorCallback));
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