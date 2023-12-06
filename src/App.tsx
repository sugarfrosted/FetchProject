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
import { AuthContext, DogLookupContext } from './state/DogContext';
import connectionSettings from './Connection.json'

function App() {
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [loginPaneOpen, setLoginPaneOpen] = useState(false);
  const api = useMemo(() => { return new DogFetchInterviewApi(connectionSettings.SERVER_URL); }, [])

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

  var authLookup = new Authentication(api);
  var dogLookup = new DogLookup(api);

  return (
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


  );
}

export default App;
