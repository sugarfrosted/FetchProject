import { AuthContext, DogLookupContext, ErrorContext, } from './state/DogContext';
import Authentication from './api/auth/Authentication';
import DogFetchInterviewApiMock from './api/shared/DogFetchInterviewApiMock';
import DogLookup from './api/data/DogLookup';
import DogSearchActivity from './components/DogSearchActivity';
import ExceptionHandler from './api/shared/ExceptionHandler';
import React from 'react';
import { RecoilRoot, } from 'recoil';
import { render, } from '@testing-library/react';

test('renders App', () => {
    render(<MockApp />);
});



function MockApp() {
    const api = React.useMemo(() => { return new DogFetchInterviewApiMock(); }, []);
    const authLookup = React.useMemo(() => new Authentication(api), [api]);
    const dogLookup = React.useMemo(() => new DogLookup(api), [api]);
    const errorLookup = React.useMemo(() => new ExceptionHandler(api), [api]);

    return (
    /* eslint-disable indent */
      <RecoilRoot>
        <ErrorContext.Provider value={errorLookup}>
          <DogLookupContext.Provider value={dogLookup}>
            <AuthContext.Provider value={authLookup}>
              <DogSearchActivity/>
            </AuthContext.Provider>
          </DogLookupContext.Provider>
        </ErrorContext.Provider>
      </RecoilRoot>
    /* eslint-enable indent */
    );
}