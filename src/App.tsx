import { useMemo, useState } from 'react';
import './App.css';
import { Box, Container } from '@mui/material';
import LoginPane from './components/LoginPane';
import TopBar from './components/TopBar';
import DogGreeting from './components/DogGreeting';
import DogSearch from './components/DogSearch';
import Authentication from './api/auth/Authentication';
import DogFetchInterviewApi from './api/shared/DogFetchInterviewApi';
import DogLookup from './api/data/DogLookup';
import { AuthContext, DogLookupContext, ErrorContext } from './state/DogContext';
import connectionSettings from './Connection.json'
import ExceptionHandler from './api/shared/ExceptionHandler';

function App() {
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [loginPaneOpen, setLoginPaneOpen] = useState(false);
  const api = useMemo(() => { return new DogFetchInterviewApi(connectionSettings.SERVER_URL); }, [])
  const authLookup = useMemo(() => new Authentication(api), [api]);
  const dogLookup = useMemo(() => new DogLookup(api), [api]);
  const errorLookup = useMemo(() => new ExceptionHandler(api), [api])

  function onLoginSuccessHandler(name: string, email: string) : void
  {
    setCurrentUserName(name);
    setCurrentUserEmail(email);
  }

  function onLoginCloseHandler()
  {
    setLoginPaneOpen(false);
  }

  const logoutClickedHandler = async (authLookup: Authentication) => {
    authLookup.Logout().then(() => {
      setCurrentUserName(null);
      setCurrentUserEmail(null);
    },
    (rejection) => {
      setCurrentUserName(null);
      setCurrentUserEmail(null);
    },);
  };

  const loginClickedHandler = () => {
    setLoginPaneOpen(true);
  };

  return (
    <ErrorContext.Provider value={errorLookup}>
      <DogLookupContext.Provider value={dogLookup}>
        <AuthContext.Provider value={authLookup} >
          <Box sx={{ flexGrow: 1 }}>
            <TopBar name={currentUserName} email={currentUserEmail} loginClickedHandler={loginClickedHandler} logoutClickedHandler={logoutClickedHandler}/>
              <Container>
                { currentUserName && currentUserEmail ? <DogSearch /> : <DogGreeting /> }
              </Container>
            <LoginPane onSuccess={onLoginSuccessHandler} onClose={onLoginCloseHandler} open={loginPaneOpen} />
          </Box>
        </AuthContext.Provider>
      </DogLookupContext.Provider>
    </ErrorContext.Provider>
  );
}

export default App;
