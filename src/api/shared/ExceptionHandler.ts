import {
    AxiosError,
} from "axios";
import DogFetchInverviewApi from "./DogFetchInterviewApi";

export default class ExceptionHandler {

    private _api: DogFetchInverviewApi;

    constructor(api: DogFetchInverviewApi) {
        this._api = api;
    }

    /**
     * Handles supported error types, currently these are just `AxiosError`.
     * Otherwise throws it to the standard handler.
     * @param error The error.
     * @param callback callback for supported error types.
     */
    public async HandleError(error: any, callback?: () => void) {
        if (error instanceof AxiosError) {
            await this.HandleLogout(callback);
        } else {
            throw error;
        }
    }

    /**
     * Does the log out on error. This is for `AxiosError` because they imply issue with connecting.
     * @param callback A call back to be ran after logging out.
     */
    private async HandleLogout(callback?: () => void) {
        try {
            await this._api.Post_Auth_Logout();
        } catch {
            /* attempt a logout, if we're already logged out it will fail */
        } finally {
            if (callback) {
                callback();
            }
        }
    }

}