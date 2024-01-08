import axios, { AxiosRequestConfig, } from 'axios';
import DogFetchInverviewApi, { LoginResponse, } from './DogFetchInterviewApi';
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


test("Check login and logout loop", async() => {
    await expect(sharedApi.Post_Auth_Login("Kittens McCat", "cats@cats.org"))
        .resolves
        .toMatchObject({name: "Kittens McCat", email: "cats@cats.org", isLoggedIn: true} as LoginResponse);

    expect(sharedApi.Name).toStrictEqual("Kittens McCat");
    expect(sharedApi.Email).toStrictEqual("cats@cats.org");
    expect(sharedApi.IsLoggedIn).toStrictEqual(true);

    await expect(sharedApi.Post_Auth_Logout()).resolves.toBeUndefined();

    expect(sharedApi.Name).toBeNull();
    expect(sharedApi.Email).toBeNull();
    expect(sharedApi.IsLoggedIn).toStrictEqual(false);
});


test("Get Breeds", async () => {
    await expect(sharedApi.Get_Dogs_Breeds()).resolves.toMatchObject(["Afghan", "Beagle", "Chihuahua", "Dachshund", "English Setter"]);
    timedOut.value = true;
    await expect(sharedApi.Get_Dogs_Breeds()).resolves.toMatchObject([]);
});

