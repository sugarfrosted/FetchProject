import axios, {AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults} from 'axios'
import { Dog, DogsSearchResult, Match } from './data/interfaces';

export default class DogApiSession {
    private _name: string = "";
    public get Name(): string {
        return this._name;
    }
    protected set Name(value: string) {
        this._name = value;
    }

    private _email: string = "";
    public get Email(): string {
        return this._email;
    }
    protected set Email(value: string) {
        this._email = value;
    }

    private axiosInstance: AxiosInstance;

    constructor() {
        const baseURL = "https://frontend-take-home-service.fetch.com"; // TODO: Move this to a configuration file
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            timeout: 1000,
            withCredentials: true,
        } as CreateAxiosDefaults<any>);
    }

    /**
     * Login to the api and start a new session
     */
    public async Post_Auth_Login(name:string, email: string) {
        this.Name = name;
        this.Email = email;

        const request = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/auth/login',
                data: {
                    name: this.Name,
                    email: this.Email,
                }
            }
        );

        if (request.status !== 200)
        {
            Promise.reject("Not successful.");
        }
    }

    public async Post_Auth_Logout(){
        const request = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/auth/logout',
            }
        );

        if (request.status !== 200)
        {
            Promise.reject("Not successful.");
        }
    };


    public async Get_Dogs_Breeds(): Promise<string[]>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/breeds',
            });

        if (response.status !== 200)
        {
            Promise.reject("Not successful.")
        }

        return (response.data && []) as string[]

    }

    public async Get_Dogs_Search(params: dogParams): Promise<DogsSearchResult>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/search',
                params: params,
            });

        if (response.status !== 200)
        {
            return Promise.reject('Not successful');
        }

        return response.data as DogsSearchResult;
    }
    
    public async Post_Dogs(dogsIds: string[]) : Promise<Dog[]> {

        const result = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs',
                data: dogsIds,
            }
        );
        if (result.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return result.data as Dog[];
    }

    public async Post_Dogs_Match(dogsIds: string[]) : Promise<Match> {

        const result = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs/match',
                data: dogsIds,
            });

        if (result.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return result.data as Match;
    }

    public async Post_Locations(zipCodes: string[]) : Promise<Location[]>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: zipCodes,
            });

        if (response.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return (response.data && []) as Location[];
    }

    public async Locations_Search(params: locationsParams) : Promise<mapSearchResults>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: params,
            });

        if (response.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return response.data as mapSearchResults;
    }
}

interface mapSearchResults {
    results: Location[];
    total: number;
}


export interface dogParams
{
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: number;
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
