import {
    Dog,
    DogsSearchResult,
    Location,
    Match,
} from './DogLookupInterfaces';
import IDogFetchInterviewApi, { dogParams, locationsParams, mapSearchResults, } from './IDogFetchInterviewApi';
import axios, {
    AxiosInstance,
    AxiosResponse,
    CreateAxiosDefaults,
} from 'axios';

export default class DogFetchInverviewApi implements IDogFetchInterviewApi {

    IsLoggedIn: boolean = false;

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

    private axiosInstance: AxiosInstance;

    /**
     * Login to the api and start a new session
     */
    public async Post_Auth_Login(name: string, email: string): Promise<{ name: string; email: string; isLoggedIn: boolean; }> {
        const request = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/auth/login',
                data: {
                    name: name,
                    email: email,
                },
            }
        );

        if (request.status !== 200 && request.status !== 401) {
            Promise.reject(request.status);
        }

        this.Name = name;
        this.Email = email;
        this.IsLoggedIn = true;

        return { name: this.Name, email: this.Email, isLoggedIn: this.IsLoggedIn };

    }

    /**
     * Revoke cookie
     */
    public async Post_Auth_Logout(): Promise<void> {
        await this.axiosInstance.request(
            {
                method: 'post',
                url: '/auth/logout',
            }
        ).finally(() => {
            this.Name = null;
            this.Email = null;
            this.IsLoggedIn = false;
        });
    }

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            timeout: 1000,
            withCredentials: true,
        } as CreateAxiosDefaults<any>);
    }


    public async Get_Dogs_Breeds(): Promise<string[]> {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/breeds',
            }) as AxiosResponse<string[]>;

        return response.data || [];
    }

    public async Get_Dogs_Search(params: dogParams): Promise<DogsSearchResult> {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/search',
                params: params,
            }) as AxiosResponse<DogsSearchResult>;

        return response.data;
    }

    public async Post_Dogs(dogsIds: string[] | string) : Promise<Dog[]> {
        const dogsIdArray: string[] = typeof dogsIds === 'string' ? [dogsIds] : dogsIds;

        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs',
                data: dogsIdArray,
            }
        ) as AxiosResponse<Dog[]>;

        return response.data || [];
    }

    public async Post_Dogs_Match(dogsIds: string[]) : Promise<Match> {

        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs/match',
                data: dogsIds,
            }) as AxiosResponse<Match>;

        return response.data;
    }

    public async Post_Locations(zipCodes: string[]) : Promise<Location[]> {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: zipCodes,
            }) as AxiosResponse<Location[]>;

        return response.data || [];
    }

    public async Post_Locations_Search(params: locationsParams) : Promise<mapSearchResults> {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations/search',
                data: params,
            }) as AxiosResponse<mapSearchResults>;

        return response.data;
    }

    public async Run_Get_Query(request: string ) : Promise<DogsSearchResult> {
        if (request.match(/^\/dogs\/search\?/i)) {
            var response = await this.axiosInstance.get(request);
            return response.data as Promise<DogsSearchResult>;
        }

        return Promise.reject("Unsupported call.");
    }
}
