import DogFetchInterviewApiMockData, { dogDataFormat } from "./DogFetchInterviewApiMockData";
import { Dog, } from "../shared/DogLookupInterfaces";

var api: TestDogFetchInterviewApiMockData;

class TestDogFetchInterviewApiMockData extends DogFetchInterviewApiMockData {
    public static ExposedGetSharesStatesFunction(states: string[]) {
        return TestDogFetchInterviewApiMockData.getSharesStatesFunction(states);
    }

    public static ExposedMapStateZip(state: string, zip: string) {
        return TestDogFetchInterviewApiMockData.mapStateZip({zip: zip, state: state});
    }

    constructor(dogs?: dogDataFormat) {
        super();
        if (dogs) {
            this.dogData = TestDogFetchInterviewApiMockData.mapDogs(dogs);
        }
    }
}

test("mapStateZip Works with states provided", () => {
    let stateFunction = TestDogFetchInterviewApiMockData.ExposedGetSharesStatesFunction(["CA", "OR"]);

    expect(stateFunction(["BC"])).toBe(false);
    expect(stateFunction(["CA"])).toBe(true);
    expect(stateFunction([])).toBe(false);
    expect(stateFunction(["OR"])).toBe(true);
    expect(stateFunction(["CA", "OR"])).toBe(true);
    expect(stateFunction(["CA", "OR", "BC"])).toBe(true);
    expect(stateFunction(["CA", "BC"])).toBe(true);
    expect(stateFunction(["BC", "CA"])).toBe(true);

});

test("mapStateZip Works with no states provided", () => {
    let stateFunction = TestDogFetchInterviewApiMockData.ExposedGetSharesStatesFunction([]);

    expect(stateFunction([])).toBe(false);
    expect(stateFunction(["OR"])).toBe(false);
    expect(stateFunction(["CA", "OR"])).toBe(false);
    expect(stateFunction(["CA", "OR", "BC"])).toBe(false);

});

test("mapStateZip with complicated test", () => {
    let stateFunction = TestDogFetchInterviewApiMockData.ExposedGetSharesStatesFunction([
        "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS",
        "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS",
        "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS",
        "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS", "CA", "OR", "FL", "BS"]
    );
    expect(stateFunction(["BC", "BF", "CF", "GH", "AR", "AL", "BF", "CF", "GH", "AR", "AL",
        "BC", "BF", "CF", "GH", "AR", "AL", "BF", "CF", "GH", "AR", "AL"])).toBe(false);


});

test("mapStateZip Has Expected Form for input", () => {
    var result = TestDogFetchInterviewApiMockData.ExposedMapStateZip("CA", "95678");
    expect(result).toBeDefined();
    expect(result.state).toEqual("CA");
    expect(result.zip_code).toEqual("95678");
    expect(result.county).toBeDefined();
    expect(result.latitude).toBeDefined();
    expect(result.longitude).toBeDefined();
    expect(result.city).toBeDefined();

    result = TestDogFetchInterviewApiMockData.ExposedMapStateZip("CT", "06256");
    expect(result).toBeDefined();
    expect(result.state).toEqual("CT");
    expect(result.zip_code).toEqual("06256");
});

test("Get Dog From Id parses correctly", () => {
    expect(TestDogFetchInterviewApiMockData.getDataFromId("0131O821%Afghan%4%45675%Becky"))
        .toMatchObject({id: "0131O821%Afghan%4%45675%Becky", breed: "Afghan", age: 4, zip_code: "45675", name: "Becky"} as Dog);

    expect(TestDogFetchInterviewApiMockData.getDataFromId("2HOTA6175%Dachshund%5%95667%Dave"))
        .toMatchObject({id: "2HOTA6175%Dachshund%5%95667%Dave", breed: "Dachshund", age: 5, zip_code: "95667", name: "Dave"} as Dog);

    expect(TestDogFetchInterviewApiMockData.getDataFromId("2K38BE196%English_Setter%9%45675%Allen"))
        .toMatchObject({id:"2K38BE196%English_Setter%9%45675%Allen", breed: "English Setter", age: 9, zip_code: "45675", name: "Allen" } as Dog);


});

beforeEach(() => {
    var dogData = [
        { "id": "E59ZAD0%Allen%3%English_Setter%10002", "name": "Allen", "age": 3, "breed": "English Setter", "zip": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "4HSUNN1%Becky%1%Dachshund%10002", "name": "Becky", "age": 1, "breed": "Dachshund", "zip": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "Z72GAL2%Charlie%0%Chihuahua%10002", "name": "Charlie", "age": 0, "breed": "Chihuahua", "zip": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "6M37RC3%Dave%2%Beagle%10002", "name": "Dave", "age": 2, "breed": "Beagle", "zip": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "J9HVM24%Eric%4%Afghan%10002", "name": "Eric", "age": 4, "breed": "Afghan", "zip": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" }];

    api = new TestDogFetchInterviewApiMockData(dogData);
});

test("Validate GetDogIds default output count", () => {
    expect(api.GetDogIds({}).resultIds).toHaveLength(5);
});

test("Check id getter sort by age:asc", () => {
    expect(api.GetDogIds({sort: "age:asc"}).resultIds).toEqual([
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
        "J9HVM24%Eric%4%Afghan%10002",
    ]);
});

test("Check id getter sort by age:desc", () => {
    expect(api.GetDogIds({sort: "age:desc"}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
    ]);
});

test("Check id getter sort by name:desc", () => {
    expect(api.GetDogIds({sort: "name:desc"}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);
});

test("Check id getter sort by name:asc", () => {
    expect(api.GetDogIds({sort: "name:asc"}).resultIds).toEqual([
        "E59ZAD0%Allen%3%English_Setter%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "J9HVM24%Eric%4%Afghan%10002",
    ]);
});

test("Check id getter sort by breed:desc", () => {

    expect(api.GetDogIds({sort: "breed:desc"}).resultIds).toEqual([
        "E59ZAD0%Allen%3%English_Setter%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "J9HVM24%Eric%4%Afghan%10002",
    ]);
});

test("Check id getter sort by breed:asc", () => {

    expect(api.GetDogIds({sort: "breed:asc"}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);
});

test("Default Sort is breed:asc", () => {

    expect(api.GetDogIds({}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);
});

test("Validate GetDogIds paging", () => {
    var result = api.GetDogIds({size: 2});
    expect(result.resultIds).toHaveLength(2);
    expect(result.total).toStrictEqual(5);
    expect(result.resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "6M37RC3%Dave%2%Beagle%10002",
    ]);
});

test("Filter on single Breeds", () => {
    expect(api.GetDogIds({breeds: ["Afghan"]}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
    ]);

    expect(api.GetDogIds({breeds: ["Corgi"]}).resultIds).toEqual([
    ]);

    expect(api.GetDogIds({breeds: ["English Setter"]}).resultIds).toEqual([
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);
});

test("Filter on multiple Breeds", () => {
    expect(api.GetDogIds({breeds: ["Afghan", "Beagle"]}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "6M37RC3%Dave%2%Beagle%10002",
    ]);

    expect(api.GetDogIds({breeds: ["Afghan", "Corgi"]}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
    ]);
});

test("Filter on ages", () => {
    expect(api.GetDogIds({ageMax: 3, ageMin:1}).resultIds).toEqual([
        "6M37RC3%Dave%2%Beagle%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);

    expect(api.GetDogIds({ageMax: 3}).resultIds).toEqual([
        "6M37RC3%Dave%2%Beagle%10002",
        "Z72GAL2%Charlie%0%Chihuahua%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);

    expect(api.GetDogIds({ageMin: 2}).resultIds).toEqual([
        "J9HVM24%Eric%4%Afghan%10002",
        "6M37RC3%Dave%2%Beagle%10002",
        "E59ZAD0%Allen%3%English_Setter%10002",
    ]);

});

test("Filter on zipCode", () => {
    expect(api.GetDogIds({zipCodes: ["00111"]}).resultIds).toHaveLength(0);
    expect(api.GetDogIds({zipCodes: ["10002"]}).resultIds).toHaveLength(5);
});