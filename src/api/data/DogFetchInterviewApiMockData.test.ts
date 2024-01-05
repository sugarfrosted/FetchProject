import { Dog, } from "../shared/DogLookupInterfaces";
import DogFetchInterviewApiMockData from "./DogFetchInterviewApiMockData";


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

test.only("Check id getter", () => {

    var dogData = [
        { "id": "E59ZAD0%Allen%0%English Setter%10002", "breed": "Allen", "age": 3, "zip": "English Setter", "name": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "4HSUNN1%Becky%1%Dachshund%10002", "breed": "Becky", "age": 1, "zip": "Dachshund", "name": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "Z72GAL2%Charlie%2%Chihuahua%10002", "breed": "Charlie", "age": 0, "zip": "Chihuahua", "name": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "6M37RC3%Dave%3%Beagle%10002", "breed": "Dave", "age": 2, "zip": "Beagle", "name": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" },
        { "id": "J9HVM24%Eric%4%Afghan%10002", "breed": "Eric", "age": 4, "zip": "Afghan", "name": "10002", "img": "https://corgiorgy.com/corgiswimflip.gif" }];

    var api = new TestDogFetchInterviewApiMockData(dogData);


    //expect(api.GetDogIds({}).resultIds).toHaveLength(5);

    expect(api.GetDogIds({sort: "age:asc"}).resultIds).toEqual([
        "E59ZAD0%Allen%0%English Setter%10002",
        "4HSUNN1%Becky%1%Dachshund%10002",
        "Z72GAL2%Charlie%2%Chihuahua%10002",
        "6M37RC3%Dave%3%Beagle%10002",
        "J9HVM24%Eric%4%Afghan%10002"]);

});
