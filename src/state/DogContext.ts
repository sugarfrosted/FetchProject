import {
    createContext,
} from 'react';
import DogLookup from '../api/data/DogLookup';
import Authentication from '../api/auth/Authentication';
import ErrorHandler from '../api/shared/ExceptionHandler';

export const DogLookupContext = createContext(null! as DogLookup);
export const AuthContext = createContext(null! as Authentication);
export const ErrorContext = createContext(null! as ErrorHandler);
