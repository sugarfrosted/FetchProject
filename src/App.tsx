import {
    useMemo,
} from 'react';
import './App.css';
import Authentication from './api/auth/Authentication';
import DogFetchInterviewApi from './api/shared/DogFetchInterviewApi';
import DogLookup from './api/data/DogLookup';
import {
    AuthContext,
    DogLookupContext,
    ErrorContext,
} from './state/DogContext';
import connectionSettings from './Connection.json';
import ExceptionHandler from './api/shared/ExceptionHandler';
import {
    RecoilRoot,
} from 'recoil';
import DogSearchActivity from './components/DogSearchActivity';

function App() {
    const api = useMemo(() => { return new DogFetchInterviewApi(connectionSettings.SERVER_URL); }, []);
    const authLookup = useMemo(() => new Authentication(api), [api]);
    const dogLookup = useMemo(() => new DogLookup(api), [api]);
    const errorLookup = useMemo(() => new ExceptionHandler(api), [api]);

    return (
    /* eslint-disable indent */
      <ErrorContext.Provider value={errorLookup}>
        <DogLookupContext.Provider value={dogLookup}>
          <AuthContext.Provider value={authLookup}>
            <RecoilRoot>
              <DogSearchActivity/>
            </RecoilRoot>
          </AuthContext.Provider>
        </DogLookupContext.Provider>
      </ErrorContext.Provider>
    /* eslint-enable indent */
    );
}

export default App;
