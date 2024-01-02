import { split } from 'lodash';
import Data from './DogFetchInterviewApiMockDogData.json';
import { Dog } from './DogLookupInterfaces';
import { dogParams } from './DogFetchInterviewApi';

type dogSortKey = (keyof Dog & ('name' | 'age' | 'breed'));

export class DogFetchInverviewApiMockData {
    constructor() {
        this.dogData = Data.dogs.map(value => {
            return {age: value.age, breed: value.breed, zip_code: value.zip, name: value.name, img: value.img, id: value.id } as Dog;
        });

    }

    private dogData: Dog[];

    public GetDogIds(params: dogParams) {
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
    }

    public ParseDogIds
}

//Encoding the data into the string. They're just mocks and it doesn't really make sense to look up anything!

