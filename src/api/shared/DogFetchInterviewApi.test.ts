import DogFetchInverviewApi, { LoginResponse, } from './DogFetchInterviewApi';
import axios, { AxiosRequestConfig, } from 'axios';
import { DogsSearchResult, } from './DogLookupInterfaces';
import { GetAxiosResponseHandler, } from '../../test/DogFetchInterviewMockAxios';
import { dogParams, } from './IDogFetchInterviewApi';


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

test("Get_Dogs_Search is hooked up", async () => {
    await expect(sharedApi.Get_Dogs_Search({})).resolves.toBeTruthy();
});

test("Get_Dogs_Search test result counts", async () => {
    var searchResult: DogsSearchResult | undefined;
    var count = 0;
    await expect(sharedApi.Get_Dogs_Search({}).then(result => {
        searchResult = result;
        return result;
    })).resolves.toBeTruthy();

    expect(searchResult?.resultIds).toBeTruthy();
    expect(searchResult?.resultIds || []).toHaveLength(25);
    expect(count = searchResult?.total || 0).toBeGreaterThanOrEqual(25);

    searchResult = undefined as DogsSearchResult | undefined;
    await expect(sharedApi.Get_Dogs_Search({size: 10} as dogParams).then(result => {
        searchResult = result;
        return result;
    })).resolves.toBeTruthy();

    expect(searchResult?.resultIds).toBeTruthy();
    expect(searchResult?.resultIds || []).toHaveLength(10);
    expect(searchResult?.total || 0).toBeGreaterThanOrEqual(count);

    let second = searchResult?.resultIds[1];
    searchResult = undefined as DogsSearchResult | undefined;
    await expect(sharedApi.Get_Dogs_Search({size: 10, from: 1} as dogParams).then(result => {
        searchResult = result;
        return result;
    })).resolves.toBeTruthy();

    expect(searchResult?.resultIds).toBeTruthy();
    expect(searchResult?.resultIds || []).toHaveLength(10);
    expect(searchResult?.total || 0).toBeGreaterThanOrEqual(count);
    expect(searchResult?.resultIds[0]).toEqual(second);
});

// Test to test if the query variables are passed.
// Test that the sort is passed. We have a test for the logic so just one check each. Set size to 10000 just to be sure.


// Post dogs after getting ids
// Get a match from ids pulled from above

// Locations

// Locations search if used


