import axios, {AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults} from 'axios'
import { Dog, DogsSearchResult, Match } from './interfaces';

export default class DogApiSession {
    private axiosInstance: AxiosInstance;

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

        if (response.status !== 200)
        {
            Promise.reject("Not successful.")
        }

        return response.data && [];

    }

    public async Get_Dogs_Search(params: dogParams): Promise<DogsSearchResult>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'get',
                url: '/dogs/search',
                params: params,
            }) as AxiosResponse<DogsSearchResult>;

        if (response.status !== 200)
        {
            return Promise.reject('Not successful');
        }

        return response.data;
    }
    
    public async Post_Dogs(dogsIds: string[]) : Promise<Dog[]> {

        const result = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs',
                data: dogsIds,
            }
        ) as AxiosResponse<Dog[]>;

        if (result.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return result.data && [];
    }

    public async Post_Dogs_Match(dogsIds: string[]) : Promise<Match> {

        const result = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/dogs/match',
                data: dogsIds,
            }) as AxiosResponse<Match>;

        if (result.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return result.data;
    }

    public async Post_Locations(zipCodes: string[]) : Promise<Location[]>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: zipCodes,
            }) as AxiosResponse<Location[]>;

        if (response.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return response.data && [];
    }

    public async Locations_Search(params: locationsParams) : Promise<mapSearchResults>
    {
        const response = await this.axiosInstance.request(
            {
                method: 'post',
                url: '/locations',
                data: params,
            }) as AxiosResponse<mapSearchResults>;

        if (response.status !== 200)
        {
            return Promise.reject('Not successful.');
        }

        return response.data;
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
