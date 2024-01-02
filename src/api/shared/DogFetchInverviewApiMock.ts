import {
    Dog,
    DogsSearchResult,
    Location,
    Match,
} from './DogLookupInterfaces';
import { dogParams, locationsParams, mapSearchResults, } from './DogFetchInterviewApi';
import { IDogFetchInterviewApi, } from './IDogFetchInterviewApi';


export class DogFetchInverviewApiMock implements IDogFetchInterviewApi {

    IsLoggedIn = false;
    public IsInErrorMode: boolean;

    constructor(isInErrorMode: boolean) {
        this.IsInErrorMode = !!isInErrorMode;
    }

    private _name: string | null = null;
    public get Name(): string | null {
        return this._name;
    }
    protected set Name(value: string | null) {
        this._name = value;
    }

    private _email: string | null = null;
    public get Email(): string | null {
        return this._email;
    }
    protected set Email(value: string | null) {
        this._email = value;
    }

    Post_Auth_Login(name: string, email: string): Promise<{ name: string; email: string; isLoggedIn: boolean; }> {

        if (this.IsInErrorMode) {
            return Promise.reject(401);
        }

        this.Name = name;
        this.Email = email;
        this.IsLoggedIn = true;

        return Promise.resolve({ name: this.Name, email: this.Email, isLoggedIn: this.IsLoggedIn });
    }
    Post_Auth_Logout(): Promise<void> {
        this.Name = null;
        this.Email = null;
        this.IsLoggedIn = false;

        return Promise.resolve();
    }

    Get_Dogs_Breeds(): Promise<string[]> {
        if (this.IsInErrorMode) {
            return Promise.reject(401);
        }
        return Promise.resolve(["Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter"]);
    }

    Get_Dogs_Search(params: dogParams): Promise<DogsSearchResult> {
        throw new Error('Method not implemented.');
    }

    Post_Dogs(dogsIds: string | string[]): Promise<Dog[]> {
        throw new Error('Method not implemented.');
    }

    Post_Dogs_Match(dogsIds: string[]): Promise<Match> {
        throw new Error('Method not implemented.');
    }

    Post_Locations(zipCodes: string[]): Promise<Location[]> {
        throw new Error('Method not implemented.');
    }

    Post_Locations_Search(params: locationsParams): Promise<mapSearchResults> {
        throw new Error('Method not implemented.');
    }

    Run_Get_Query(request: string): Promise<DogsSearchResult> {
        throw new Error('Method not implemented.');
    }

}
