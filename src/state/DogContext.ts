import { createContext } from 'react';
import DogLookup from '../api/data/DogLookup';
import Authorization from '../api/auth/Authorization';

export const DogLookupContext = createContext(null as DogLookup | null);
export const AuthContext = createContext(null as Authorization | null);
