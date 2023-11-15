import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios'

/**
 * The api calls that handle authorization.
 */
export default class Authorization {
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
    public async Post_Auth_Login(name: string, email: string) {
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

        if (request.status !== 200)
        {
            Promise.reject("Not successful.");
        }

        this.Name = name;
        this.Email = email;

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

        if (request.status !== 200)
        {
            Promise.reject("Not successful.");
        }
    }
}