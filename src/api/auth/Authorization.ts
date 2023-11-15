import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios'

/**
 * The api calls that handle authorization.
 */
export default class Authorization {
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
    public async Post_Auth_Login(name: string, email: string) {
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

        if (request.status !== 200)
        {
            Promise.reject("Not successful.");
        }
    }
}