import {
    Dog,
    DogsSearchResult,
    Location,
    Match,
} from './DogLookupInterfaces';
import IDogFetchInterviewApi, { dogParams, locationsParams, mapSearchResults, } from './IDogFetchInterviewApi';
import DogFetchInterviewApiMockData from '../data/DogFetchInterviewApiMockData';


export default class DogFetchInterviewApiMock implements IDogFetchInterviewApi {

    public IsLoggedIn: boolean;
    public IsConnectionTimedOut: boolean;

    constructor(isConnectionTimedOut: boolean = false, isLoggedIn: boolean = false) {
        this.IsLoggedIn = isLoggedIn;
        this.IsConnectionTimedOut = isConnectionTimedOut;
    }

    private get IsInErrorMode(): boolean {
        return !this.IsLoggedIn || this.IsConnectionTimedOut;
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
        if (this.IsInErrorMode) {
            return Promise.reject(401);
        }

        var dogs: Dog[] = [];
        if (typeof dogsIds === 'string') {
            dogsIds = [dogsIds];
        }
        for (let id of dogsIds) {
            dogs.push(DogFetchInterviewApiMockData.getDataFromId(id));
        }

        return Promise.resolve(dogs);
    }

    Post_Dogs_Match(dogsIds: string[]): Promise<Match> {
        if (this.IsInErrorMode) {
            return Promise.reject(401);
        }

        if (dogsIds.length === 0) {
            // no match found
            return Promise.resolve({} as Match);
        }

        return Promise.resolve({ match: dogsIds[0]});

    }

    /** Not actually used by the application, so leaving it unimplemented */
    Post_Locations(zipCodes: string[]): Promise<Location[]> {
        if (this.IsInErrorMode) {
            return Promise.reject(401);
        }

        throw new Error('Method not implemented.');
    }

    Post_Locations_Search(params: locationsParams): Promise<mapSearchResults> {
        if (this.IsInErrorMode) {
            return Promise.reject(401);
        }

        return Promise.resolve(DogFetchInterviewApiMockData.MapZipCodes(params));
    }

    /** Not implemented. */
    Run_Get_Query(request_: string): Promise<DogsSearchResult> {
        throw new Error('Method not implemented.');
    }

}
