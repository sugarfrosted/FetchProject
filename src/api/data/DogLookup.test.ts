import axios, { AxiosRequestConfig, } from 'axios';
import DogFetchInverviewApi from '../shared/DogFetchInterviewApi';
import DogLookup from './DogLookup';
import { GetAxiosResponseHandler, } from '../../test/DogFetchInterviewMockAxios';


const timedOut = {value: false};

jest.mock('axios');
const mocked_axios = jest.mocked(axios);
var sharedApi: DogFetchInverviewApi;


beforeEach(() => {
    timedOut.value = false;
    mocked_axios.request.mockImplementation((config: AxiosRequestConfig<unknown> ) => {

        return GetAxiosResponseHandler(config, timedOut);
    });

    sharedApi = new DogFetchInverviewApi("aaaaa");
});

describe('test when loggedIn', () => {
    var doglookup: DogLookup;
    beforeEach(() => {
        sharedApi.Post_Auth_Login("Kittens McCat", "cats@cats.org");
        doglookup = new DogLookup(sharedApi);
    });

    test("LoadDogs works", async () => {
        await expect(doglookup.LoadDogs({})).resolves.toBeTruthy();
    });

    test("LoadDogBreeds Works", async () => {
        await expect(doglookup.LoadDogBreeds()).resolves.toBeUndefined();
    });

    test("LoadDogBreeds Loads", async () => {
        await doglookup.LoadDogBreeds();
        expect(doglookup.DogBreeds.length).toBeGreaterThan(0);
    });
});