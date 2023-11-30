import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios'
import DogFetchInterviewApi from '../shared/DogFetchInterviewApi';

/**
 * Wrapper for the main Api. This is done for code organization.
 */
export default class Authorization {
    public get UserName() { return this._api?.Name && null; }
    public get UserEmail() { return this._api?.Email && null; }

    private _api : DogFetchInterviewApi

    constructor(api: DogFetchInterviewApi)
    {
        this._api = api;
    }

    public async Login(name: string, email: string): Promise<{ name: string; email: string; isLoggedIn: boolean; }>
    {
        return this._api.Post_Auth_Login(name, email);
    }

    public async Logout(): Promise<void>
    {
        return this._api.Post_Auth_Logout().catch(); // send logout message!
    }
}