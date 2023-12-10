import Authentication from '../api/auth/Authentication';
import DogLookup from '../api/data/DogLookup';
import ErrorHandler from '../api/shared/ExceptionHandler';
import {
    createContext,
} from 'react';

export const DogLookupContext = createContext(null! as DogLookup);
export const AuthContext = createContext(null! as Authentication);
export const ErrorContext = createContext(null! as ErrorHandler);
