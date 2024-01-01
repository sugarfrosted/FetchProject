import {
    Dog,
    DogsSearchResult,
    Location,
    Match
} from './DogLookupInterfaces';
import { dogParams, locationsParams, mapSearchResults } from './DogFetchInterviewApi';


export interface IDogFetchInterviewApi {
    get Name(): string | null;

    get Email(): string | null;
    Post_Auth_Login(name: string, email: string): Promise<{ name: string; email: string; isLoggedIn: boolean; }>;
    Post_Auth_Logout(): Promise<void>;
    Get_Dogs_Breeds(): Promise<string[]>;
    Get_Dogs_Search(params: dogParams): Promise<DogsSearchResult>;
    Post_Dogs(dogsIds: string[] | string): Promise<Dog[]>;
    Post_Dogs_Match(dogsIds: string[]): Promise<Match>;
    Post_Locations(zipCodes: string[]): Promise<Location[]>;
    Post_Locations_Search(params: locationsParams): Promise<mapSearchResults>;
    Run_Get_Query(request: string): Promise<DogsSearchResult>;
}
