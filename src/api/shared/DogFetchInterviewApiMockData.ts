import { Dog, DogsSearchResult, } from './DogLookupInterfaces';
import Data from './DogFetchInterviewApiMockDogData.json';
import { dogParams, } from './DogFetchInterviewApi';

type dogSortKey = (keyof Dog & ('name' | 'age' | 'breed'));

export class DogFetchInverviewApiMockData {
    constructor() {
        this.dogData = Data.dogs.map(value => {
            return {age: value.age, breed: value.breed, zip_code: value.zip, name: value.name, img: value.img, id: value.id } as Dog;
        });

    }

    private dogData: Dog[];

    private static GetFilterFunction(params: dogParams) {
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
            var sortDirectionFactor = sortDirection === 'asc' ? 1 : -1;
            if (typeof a[sortKey] === "number" && b[sortKey] === "number") {
                return sortDirectionFactor * ((a[sortKey] as number) - (b[sortKey] as number));
            } else {
                return sortDirectionFactor * ((a[sortKey] < b[sortKey]) ? -1 : ((a[sortKey] > b[sortKey]) ? 1 : 0));
            }
        };

        this.dogData.sort(sortFunction);

        var rangeStart = params.from || 0;
        var rangeEnd = rangeStart + (params.size || 25);

        var totalResults = this.dogData.filter(DogFetchInverviewApiMockData.GetFilterFunction(params))
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

    public static MapZipCodes(states: string[], city?: string) {
        if (city && (city.search(/nowhere/i) > -1)) {
            return undefined;
        }

        if (states && states.length === 0 ) {
            return ["00111", "06256", "10002", "20345", "30456", "45675", "53713", "67854", "78594", "84857", "95667"];
        }

        var containsStates = this.getSharesStatesFunction(states);
        var zips: string[] = [];

        if (containsStates(["NL", "PE", "NS", "NB", "QC", "ON", "MB", "SK", "AB", "BC", "YT", "NT", "NU"])) {
            zips = zips.concat(["00111"]);
        }
        if (containsStates(["CT", "MA", "ME", "NH", "NJ", "NY", "PR", "RI", "VT", "VI"])) {
            zips = zips.concat(["06256"]);
        }
        if (containsStates(["DE", "NY", "PA"])) {
            zips = zips.concat(["10002"]);
        }
        if (containsStates(["DC", "MD", "NC", "SC", "VA", "WV"])) {
            zips = zips.concat(["20345"]);
        }
        if (containsStates(["AL", "FL", "GA", "MS", "TN"])) {
            zips = zips.concat(["30456"]);
        }
        if (containsStates(["IN", "KY", "MI", "OH"])) {
            zips = zips.concat(["45675"]);
        }
        if (containsStates(["IA", "MN", "MT", "ND", "SD", "WI"])) {
            zips = zips.concat(["53713"]);
        }
        if (containsStates(["IL", "KS", "MO", "NE"])) {
            zips = zips.concat(["67854"]);
        }
        if (containsStates(["AR", "LA", "OK", "TX"])) {
            zips = zips.concat(["78594"]);
        }
        if (containsStates(["AZ", "CO", "ID", "NM", "NV", "UT", "WY"])) {
            zips = zips.concat(["84857"]);
        }
        if (containsStates(["AK", "AS", "CA", "GU", "HI", "MH", "FM", "MP", "OR", "PW", "WA"])) {
            zips = zips.concat(["95667"]);
        }




        return zips;
    }

    private static getSharesStatesFunction(states: string[]) {
        return (validStates: string[]) => states.findIndex(state => validStates.includes(state)) !== -1;
    }
}
