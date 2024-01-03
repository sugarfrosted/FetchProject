import IDogFetchInterviewApi from '../shared/IDogFetchInterviewApi';

/**
 * Wrapper for the main Api. This is done for code organization.
 */
export default class Authentication {
    public get UserName() { return this._api?.Name && null; }
    public get UserEmail() { return this._api?.Email && null; }

    private _api : IDogFetchInterviewApi;

    constructor(api: IDogFetchInterviewApi) {
        this._api = api;
    }

    /**
     * Login handler.
     * @param name Username input by user.
     * @param email Email input by user.
     * @returns Promise containing the login data if successful.
     */
    public async Login(name: string, email: string): Promise<{ name: string; email: string; isLoggedIn: boolean; }> {
        return this._api.Post_Auth_Login(name, email);
    }

    /**
     * Logout handler.
     * @returns A successful promise if logout is successful.
     */
    public async Logout(): Promise<void> {
        return this._api.Post_Auth_Logout();
    }
}