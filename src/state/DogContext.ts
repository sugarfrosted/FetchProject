import { createContext } from 'react';
import DogFetchInterviewApi from '../api/shared/DogFetchInterviewApi';

const DogContext = createContext(new DogFetchInterviewApi());

export default DogContext;