import { Dog, DogsSearchResult, } from './DogLookupInterfaces';
import DogFetchInverviewApi, { LoginResponse, } from './DogFetchInterviewApi';
import axios, { AxiosRequestConfig, } from 'axios';
import { dogParams, mapSearchResults, } from './IDogFetchInterviewApi';
import { GetAxiosResponseHandler, } from '../../test/DogFetchInterviewMockAxios';
import { uniq, } from 'lodash';


const timedOut = {value: false};

jest.mock('axios');
const mocked_axios = jest.mocked(axios);
var sharedApi: DogFetchInverviewApi;

beforeEach(() => {
    timedOut.value = false;
    (mocked_axios.request as any).mockImplementation((config: AxiosRequestConfig<unknown> ) => {

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

test("Breed is passed in Get_Dogs_Search", async () => {
    var savedResult: string[] = [];
    await expect(
        sharedApi.Get_Dogs_Search({size: 10000, breeds: ["Beagle"]})
            .then(result => {
                savedResult = result.resultIds.map(id => id.split("%", 10)[1]);
                return savedResult;
            }))
        .resolves
        .toBeTruthy();

    expect(uniq(savedResult)).toMatchObject(["Beagle"]);
});

test("MaxAge is passed in Get_Dogs_Search", async () => {
    var savedResult: string[] = [];
    await expect(
        sharedApi.Get_Dogs_Search({size: 10000, ageMax: 3})
            .then(result => {
                savedResult = result.resultIds.map(id => id.split("%", 10)[2]);
                return savedResult;
            }))
        .resolves
        .toBeTruthy();

    expect(savedResult.find(x => Number.parseFloat(x) <= 3)).toBeDefined();
    expect(savedResult.find(x => Number.parseFloat(x) % 1 !== 0)).toBeUndefined();
    expect(savedResult.find(x => Number.parseFloat(x) > 3)).toBeUndefined();
});

test("MinAge is passed in Get_Dogs_Search", async () => {
    var savedResult: string[] = [];
    await expect(
        sharedApi.Get_Dogs_Search({size: 10000, ageMin: 3})
            .then(result => {
                savedResult = result.resultIds.map(id => id.split("%", 10)[2]);
                return savedResult;
            }))
        .resolves
        .toBeTruthy();

    expect(savedResult.find(x => Number.parseFloat(x) >= 3)).toBeDefined();
    expect(savedResult.find(x => Number.parseFloat(x) % 1 !== 0)).toBeUndefined();
    expect(savedResult.find(x => Number.parseFloat(x) < 3)).toBeUndefined();
});


test("Zip is passed in Get_Dogs_Search", async () => {
    var savedResult: string[] = [];
    await expect(
        sharedApi.Get_Dogs_Search({size: 10000, zipCodes: ["45675"]})
            .then(result => {
                savedResult = result.resultIds.map(id => id.split("%", 10)[3]);
                return savedResult;
            }))
        .resolves
        .toBeTruthy();


    expect(uniq(savedResult)).toMatchObject(["45675"]);
});

// Test that the sort is passed. We have a test for the logic so just one check each. Set size to 10000 just to be sure.

test("Sort is passed", async () => {
    var savedResult: string[] = [];
    await expect(
        sharedApi.Get_Dogs_Search({size: 10000, sort: "name:desc"})
            .then(result => {
                savedResult = result.resultIds.map(id => id.split("%", 10)[4]);
                return savedResult;
            }))
        .resolves
        .toBeTruthy();

    expect(
        savedResult.find((value, index, array) => (index !== 0) && value < array[index] )
    ).toBeUndefined();
});


test("Id is passed to Post_Dogs", async () => {
    var ids = [
        "0131O821%Afghan%4%45675%Becky",
        "03QNHS52%Beagle%1%10002%Allen",
        "03ZGUM167%Dachshund%14%78594%Dave",
    ];

    await expect(sharedApi.Post_Dogs(ids)).resolves.toMatchObject(
        [
            { id: "0131O821%Afghan%4%45675%Becky", breed: "Afghan", age: 4, zip_code: "45675", name: "Becky", img: "https://corgiorgy.com/corgiswimflip.gif" } as Dog,
            { id: "03QNHS52%Beagle%1%10002%Allen", breed: "Beagle", age: 1, zip_code: "10002", name: "Allen", img: "https://corgiorgy.com/corgiswimflip.gif" } as Dog,
            { id: "03ZGUM167%Dachshund%14%78594%Dave", breed: "Dachshund", age: 14, zip_code: "78594", name: "Dave", img: "https://corgiorgy.com/corgiswimflip.gif" } as Dog,
        ]);

});


test("Location Search Works", async () => {
    var savedResult: mapSearchResults;
    await expect(sharedApi.Post_Locations_Search({states: ["CA"]})
        .then(
            result => {
                savedResult = result;
                return savedResult;
            }
        )
    ).resolves.toBeDefined();


    expect(uniq(savedResult!.results.map(x => x.zip_code[0]))).toMatchObject(["9"]);

});
