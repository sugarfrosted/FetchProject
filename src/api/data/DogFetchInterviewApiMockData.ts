import { Dog, DogsSearchResult, Location, } from '../shared/DogLookupInterfaces';
import { dogParams, locationsParams, mapSearchResults, } from '../shared/IDogFetchInterviewApi';
import Data from './DogFetchInterviewApiMockDogData.json';

type dogSortKey = (keyof Dog & ('name' | 'age' | 'breed'));

export type dogDataFormat = typeof Data.dogs;

export default class DogFetchInterviewApiMockData {
    constructor() {
        this.dogData = DogFetchInterviewApiMockData.mapDogs(Data.dogs);
    }

    protected dogData: Dog[];

    protected static mapDogs(dogs: dogDataFormat) {
        return dogs.map(value => {
            return {age: value.age, breed: value.breed, zip_code: value.zip, name: value.name, img: value.img, id: value.id } as Dog;
        });

    }

    protected static GetFilterFunction(params: dogParams) {
        return (dog: Dog, index: number) => {

            if (params.ageMin != null && dog.age < params.ageMin) {
                return false;
            }

            if (params.ageMax != null && dog.age > params.ageMax) {
                return false;
            }

            if (params.zipCodes && params.zipCodes.length > 0 && !params.zipCodes.includes(dog.zip_code)) {
                return false;
            }

            if (params.breeds && params.breeds.length > 0 && !params.breeds.includes(dog.breed)) {
                return false;
            }

            return true;
        };
    }

    public GetDogIds(params: dogParams) : DogsSearchResult {
        var sortSplit = params.sort?.split(':') || [];
        var sortKey = ['name', 'age', 'breed'].includes(sortSplit[0]) ? sortSplit[0] as dogSortKey : 'breed';
        var sortDirection = ['asc', 'desc'].includes(sortSplit[1]) ? sortSplit[1] as ('asc' | 'desc') : 'asc';

        var sortFunction: (a: Dog, b: Dog) => number = function (a: Dog, b: Dog) {
            if (typeof a[sortKey] === "number" && b[sortKey] === "number") {
                return (a[sortKey] as number) - (b[sortKey] as number);
            } else {
                return (a[sortKey] < b[sortKey]) ? -1 : ((a[sortKey] > b[sortKey]) ? 1 : 0);
            }
        };

        this.dogData.sort(sortFunction);

        if (sortDirection === 'desc') {
            this.dogData.reverse();
        }

        var rangeStart = params.from || 0;
        var rangeEnd = rangeStart + (params.size || 25);

        var totalResults = this.dogData.filter(DogFetchInterviewApiMockData.GetFilterFunction(params))
            .map(value => value.id);

        return { total: totalResults.length, resultIds: totalResults.filter((_id, index) => (rangeStart <= index && index < rangeEnd)) };
    }

    // Gotta test this unit test because it's touchy
    /**
     * Parses data from a DogID in the mock
     * @param id String in the format of <randomuniquevalue>, <breed>, <age>, <zipCode>, and <name> delimited by '%'. Breeds has underscores in place of spaces.
     * @returns A Dog value
     */
    public static getDataFromId(id: string) : Dog {
        var data = id.split('%');
        return { id: id, breed: (data[1] || "").replaceAll("_", " "), age: parseInt(data[2]) || 0, zip_code: data[3], name: data[4], img: "https://corgiorgy.com/corgiswimflip.gif" } as Dog;
    }

    public static MapZipCodes({from, city, size, states}:  locationsParams): mapSearchResults {
        var trueFrom = from || 0;
        var to = trueFrom + (size || 25);

        if ((!states || states.length === 0) && !city) {
            return {results: [], total: 0};
        }

        if (city && (city.search(/nowhere/i) > -1)) {
            return {results: [], total: 0};
        }

        if (!states || states.length === 0 ) {
            let cityStatePairs = [
                { zip: "00111", state: "ON" },
                { zip: "06256", state: "CT" },
                { zip: "10002", state: "DE" },
                { zip: "20345", state: "MD" },
                { zip: "30456", state: "AL" },
                { zip: "45675", state: "IN" },
                { zip: "53713", state: "IA" },
                { zip: "67854", state: "IL" },
                { zip: "78594", state: "AR" },
                { zip: "84857", state: "AZ" },
                { zip: "95667", state: "CA" },
            ];

            let results = cityStatePairs.map(DogFetchInterviewApiMockData.mapStateZip);

            return {
                results: results.filter((_value, index) => trueFrom <= index && index < to),
                total: results.length,
            };
        }

        var containsStates = this.getSharesStatesFunction(states);
        let cityStatePairs: {zip: string, state: string}[] = [];

        if (containsStates(["NL", "PE", "NS", "NB", "QC", "ON", "MB", "SK", "AB", "BC", "YT", "NT", "NU"])) {
            cityStatePairs.push({ zip: "00111", state: "ON" });
        }
        if (containsStates(["CT", "MA", "ME", "NH", "NJ", "NY", "PR", "RI", "VT", "VI"])) {
            cityStatePairs.push({ zip: "06256", state: "CT" });
        }
        if (containsStates(["DE", "NY", "PA"])) {
            cityStatePairs.push({ zip: "10002", state: "DE" });
        }
        if (containsStates(["DC", "MD", "NC", "SC", "VA", "WV"])) {
            cityStatePairs.push({ zip: "20345", state: "MD" });
        }
        if (containsStates(["AL", "FL", "GA", "MS", "TN"])) {
            cityStatePairs.push({ zip: "30456", state: "AL" });
        }
        if (containsStates(["IN", "KY", "MI", "OH"])) {
            cityStatePairs.push({ zip: "45675", state: "IN" });
        }
        if (containsStates(["IA", "MN", "MT", "ND", "SD", "WI"])) {
            cityStatePairs.push({ zip: "53713", state: "IA" });
        }
        if (containsStates(["IL", "KS", "MO", "NE"])) {
            cityStatePairs.push({ zip: "67854", state: "IL" });
        }
        if (containsStates(["AR", "LA", "OK", "TX"])) {
            cityStatePairs.push({ zip: "78594", state: "AR" });
        }
        if (containsStates(["AZ", "CO", "ID", "NM", "NV", "UT", "WY"])) {
            cityStatePairs.push({ zip: "84857", state: "AZ" });
        }
        if (containsStates(["AK", "AS", "CA", "GU", "HI", "MH", "FM", "MP", "OR", "PW", "WA"])) {
            cityStatePairs.push({ zip: "95667", state: "CA" });
        }

        var results = cityStatePairs.map(DogFetchInterviewApiMockData.mapStateZip);

        return {
            results: results.filter((_value, index) => trueFrom <= index && index < to),
            total: results.length,
        };
    }

    protected static getSharesStatesFunction(states: string[]) {
        return (validStates: string[]) => states.findIndex(state => validStates.includes(state)) !== -1;
    }

    protected static mapStateZip(value: {zip: string, state: string}, _index?: number, _array?: {zip: string, state: string}[]) {
        return {
            city: "Springfield",
            county: "Shelby",
            state: value.state,
            zip_code: value.zip,
            latitude: 0,
            longitude: 0,
        } as Location;
    }
}
