import { AxiosError } from "axios";
import DogFetchInverviewApi from "./DogFetchInterviewApi";

export default class ExceptionHandler {

    private _api: DogFetchInverviewApi;

    constructor(api: DogFetchInverviewApi) {
        this._api = api;
    }

    public async HandleError(error: any) {
        if (error instanceof AxiosError)
        {
            await this.HandleLogout();
            console.log("SSSSSSSSSSSSSSCREAM")
        }
        else
        {
            throw error;
        }
    }

    private async HandleLogout() {
        try {
            await this._api.Post_Auth_Logout();
        }
        catch { /* attempt a logout, if we're already logged out it will fail */ }
    }

}