import { createContext } from 'react';
import DogLookup from '../api/data/DogLookup';
import Authentication from '../api/auth/Authentication';

export const DogLookupContext = createContext(null as DogLookup | null);
export const AuthContext = createContext(null as Authentication | null);
