import './App.css';
import {
    AuthContext,
    DogLookupContext,
    ErrorContext,
} from './state/DogContext';
import Authentication from './api/auth/Authentication';
import DogFetchInterviewApi from './api/shared/DogFetchInterviewApi';
import DogLookup from './api/data/DogLookup';
import DogSearchActivity from './components/DogSearchActivity';
import ExceptionHandler from './api/shared/ExceptionHandler';
import {
    RecoilRoot,
} from 'recoil';
import Settings from './Configuration.json';
import {
    useMemo,
} from 'react';

function App() {
    const api = useMemo(() => { return new DogFetchInterviewApi(Settings.CONNECTION.SERVER_URL); }, []);
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
