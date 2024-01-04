import axios, { AxiosRequestConfig, } from 'axios';
import DogFetchInverviewApi from './DogFetchInterviewApi';
import { GetAxiosResponseHandler, } from '../../test/DogFetchInterviewMockAxios';


const timedOut = {value: false};

jest.mock('axios');
const mocked_axios = jest.mocked(axios);

beforeEach(() => {
    timedOut.value = false;
    mocked_axios.request.mockImplementation((config: AxiosRequestConfig<unknown> ) => {

        return GetAxiosResponseHandler(config, timedOut);

    });
});

test("Connected functionality",
    async () => {
        var api = new DogFetchInverviewApi("aaaaa");

        return expect(await api.Get_Dogs_Breeds()).toMatchObject(["Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter"]);
    }
);

