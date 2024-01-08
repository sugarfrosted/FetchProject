import {
    Dog,
    DogsSearchResult,
    Location,
    Match,
} from './DogLookupInterfaces';


export default interface IDogFetchInterviewApi {
    get IsLoggedIn(): boolean;
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


export interface mapSearchResults {
    results: Location[];
    total: number;
}


export interface dogParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number | undefined;
    ageMax?: number | undefined;
    size?: number;
    from?: number;
    sort?: sortCombos;
}

/**The resulting supported sort keys by the api */
export type sortCombos = 'name:asc' | 'name:desc' | 'age:asc' | 'age:desc' | 'breed:asc' | 'breed:desc';

export interface locationsParams {
    city?: string;
    states?: string[];
    geoBoundingBox?: boundingBox;
    size?: number;
    from?: number;
}

interface AllCorners {
    top: Location,
    bottom: Location,
    left: Location,
    right: Location,
}

interface BottomLeftToTopRight {
    bottom_left: Location,
    top_right: Location,
}

interface BottomRightToTopLeft {
    bottom_right: Location,
    top_left: Location,
}

export type boundingBox = BottomLeftToTopRight | BottomRightToTopLeft | AllCorners;