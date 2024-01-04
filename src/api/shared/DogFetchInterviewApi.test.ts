import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import DogFetchInverviewApi from './DogFetchInterviewApi';



jest.mock('axios');
const mocked_axios = jest.mocked(axios);

beforeEach(() => {
    mocked_axios.request.mockImplementation((config: AxiosRequestConfig<unknown> ) => {
        if (config.method === 'post' && config.url === '/auth/logout') {
            return Promise.resolve();
        }

        return Promise.reject("Not a supported request!");
    });
});

test("I'm so tired of this broken testing library",
    () => {
        var api = new DogFetchInverviewApi("aaaaa");
        return expect(api.Post_Auth_Logout()).resolves.not.toThrow();
    }
);