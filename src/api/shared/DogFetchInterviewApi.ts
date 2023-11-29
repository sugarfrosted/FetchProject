import axios, {AxiosInstance, AxiosResponse, CreateAxiosDefaults} from 'axios'
import { Dog, DogsSearchResult, Match } from './interfaces';



export default class DogFetchInverviewApi {

    private _name: string | null = null;

    IsLoggedIn: boolean = false;

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
                }
            }
        );

        if (request.status !== 200 && request.status !== 401)
        {
            Promise.reject("Not successful.");
        }

        this.Name = name;
        this.Email = email;
        this.IsLoggedIn = true;

        return {name: this.Name, email: this.Email, isLoggedIn: this.IsLoggedIn }

    }

    /**
     * Revoke cookie
     */
    public async Post_Auth_Logout(): Promise<void> {
        const request = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/auth/logout',
            }
        );

        this.Name = null;
        this.Email = null;
        this.IsLoggedIn = false;

        if (this.isRequestSuccessful(request))
        {
            Promise.reject("Not successful.");
        }
    }

    constructor() {
        const baseURL = "https://frontend-take-home-service.fetch.com"; // TODO: Move this to a configuration file
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            timeout: 1000,
            withCredentials: true,
        } as CreateAxiosDefaults<any>);
    }


    public async Get_Dogs_Breeds(): Promise<string[]>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/breeds',
            }) as AxiosResponse<string[]>;

        if (this.isRequestSuccessful(response))
        {
            Promise.reject("Not successful.")
        }

        return response.data || [];
    }

    public async Get_Dogs_Search(params: dogParams): Promise<DogsSearchResult>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/search',
                params: params,
            }) as AxiosResponse<DogsSearchResult>;

        if (this.isRequestSuccessful(response))
        {
            return Promise.reject('Not successful');
        }

        return response.data;
    }
    
    public async Post_Dogs(dogsIds: string[]) : Promise<Dog[]> {

        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs',
                data: dogsIds,
            }
        ) as AxiosResponse<Dog[]>;

        if (this.isRequestSuccessful(response))
        {
            return Promise.reject('Not successful.');
        }

        return response.data || [];
    }

    public async Post_Dogs_Match(dogsIds: string[]) : Promise<Match> {

        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs/match',
                data: dogsIds,
            }) as AxiosResponse<Match>;

        if (this.isRequestSuccessful(response))
        {
            return Promise.reject('Not successful.');
        }

        return response.data;
    }

    public async Post_Locations(zipCodes: string[]) : Promise<Location[]>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: zipCodes,
            }) as AxiosResponse<Location[]>;

        if (this.isRequestSuccessful(response))
        {
            return Promise.reject('Not successful.');
        }

        return response.data || [];
    }

    public async Locations_Search(params: locationsParams) : Promise<mapSearchResults>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: params,
            }) as AxiosResponse<mapSearchResults>;

        if (this.isRequestSuccessful(response))
        {
            return Promise.reject('Not successful.');
        }

        return response.data;
    }

    private isRequestSuccessful(request: AxiosResponse<any, any>) {
        if (request.status === 401)
        {
            this.Name = null;
            this.Email = null;
            this.IsLoggedIn = false;
        }
        return request.status !== 200;
    }
}

export interface mapSearchResults {
    results: Location[];
    total: number;
}


export interface dogParams
{
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number | undefined;
    ageMax?: number | undefined;
    size?: number;
    from?: number;
    sort?: keyof Dog | undefined;
    sortDirection?: 'asc' | 'desc' | undefined
}

export interface locationsParams
{
    city?: string;
    state?: string;
    geoBoundingBox?: boundingBox;
    size?: number;
    from?: any;
}

interface AllCorners
{
    top: Location,
    bottom: Location,
    left: Location,
    right: Location,
}

interface BottomLeftToTopRight
{
    bottom_left: Location,
    top_right: Location,
}

interface BottomRightToTopLeft
{
    bottom_right: Location,
    top_left: Location,
}

export type boundingBox = BottomLeftToTopRight | BottomRightToTopLeft | AllCorners;
