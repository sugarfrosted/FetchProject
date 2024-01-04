import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import DogFetchInverviewApi from './DogFetchInterviewApi';
import {
    validate as isValidEmail,
} from "email-validator";


const timedOut = {value: false};

jest.mock('axios');
const mocked_axios = jest.mocked(axios);

beforeEach(() => {
    timedOut.value = false;
    mocked_axios.request.mockImplementation((config: AxiosRequestConfig<unknown> ) => {
        if (timedOut.value) {
            return Promise.resolve({status: 401});
        }
        if (config.method === 'post') {
            if (config.url === '/auth/logout') {
                return Promise.resolve();
            } else if (config.url === '/auth/login') {
                let data = config.data as {name?: string, email?: string};
                if ((data.name || "").length > 0 && isValidEmail(data.email || "")) {
                    return Promise.resolve({status: 200});
                } else {
                    return Promise.resolve({status: 400});
                }
            }
        } else if (config.method === 'get') {
            if (config.url === '/dogs/breeds') {
                return Promise.resolve({status: 200, data: ["Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter"]});
            }
        }

        return Promise.reject("Not a supported request!");
    });
});

test("I'm so tired of this broken testing library",
    async () => {
        var api = new DogFetchInverviewApi("aaaaa");

        return expect(await api.Get_Dogs_Breeds()).toMatchObject(["Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter"]);
    }
);