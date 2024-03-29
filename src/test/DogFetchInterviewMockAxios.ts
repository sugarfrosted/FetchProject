import { AxiosRequestConfig, } from "axios";
import DogFetchInterviewApiMockData from "../api/data/DogFetchInterviewApiMockData";
import {
    validate as isValidEmail,
} from "email-validator";
import { locationsParams, } from "../api/shared/IDogFetchInterviewApi";

export function GetAxiosResponseHandler(config: AxiosRequestConfig<unknown>, timedOut: {value: boolean}) : Promise<any> {
    var dataServiceInstance = new DogFetchInterviewApiMockData();

    if (timedOut.value) {
        return Promise.resolve({status: 401});
    }
    switch (config.method) {
    case "post":
        return PostHandler(config);
    case "get":
        return GetHandler(config);
    default:
        throw new Error("Unknown call");
    }

    function PostHandler(config: AxiosRequestConfig<unknown>) {
        switch (config.url) {

        case '/auth/logout':
            return Promise.resolve({ status: 200 });
        case '/auth/login': {
            let data = config.data as { name?: string; email?: string; };
            if ((data.name || "").length > 0 && isValidEmail(data.email || "")) {
                return Promise.resolve({ status: 200 });
            } else {
                return Promise.resolve({ status: 400 });
            }}
        case '/dogs':
            return Promise.resolve(
                {
                    data: (config.data as string[]).map(x => DogFetchInterviewApiMockData.getDataFromId(x)),
                    status: 200,
                }
            );
        case '/dogs/match':
            return Promise.resolve(
                {
                    data: (config.data as string[])[0] || null,
                    status: 200,
                }
            );
        case '/locations':
        case '/locations/search':
            return Promise.resolve(
                {
                    data: DogFetchInterviewApiMockData.MapZipCodes(config.data as locationsParams),
                    status: 200,
                }
            );
        default:
            throw new Error(`Post Url ${config.url} not supported`);
        }
    }

    function GetHandler(config: AxiosRequestConfig<unknown>) {
        switch (config.url) {

        case '/dogs/breeds':
            return Promise.resolve({status: 200, data: ["Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter"]});
        case '/dogs/search': {
            return Promise.resolve({status: 200, data: dataServiceInstance.GetDogIds(config.params)});
        }
        default:
            throw new Error("Get Url not supported");
        }
    }
}

export function GetAxiosGetHandler(request: string, config: AxiosRequestConfig<unknown>) {
    return Promise.reject("Not Implemented");

}