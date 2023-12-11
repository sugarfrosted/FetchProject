import {
    Dog,
    DogLookupParams,
    DogsSearchResult,
} from "../shared/DogLookupInterfaces";
import DogFetchInterviewApi, {
    dogParams,
} from "../shared/DogFetchInterviewApi";
import {
    GridSortModel,
} from "@mui/x-data-grid";

export default class DogLookup {
    private _api : DogFetchInterviewApi;

    private _dogBreeds : string[] = [];

    public get DogBreeds() {
        return this._dogBreeds;
    }
    private set DogBreeds(value) {
        this._dogBreeds = value;
    }

    public get IsLoggedin() {
        return this._api.IsLoggedIn;
    }

    constructor(api: DogFetchInterviewApi) {
        this._api = api;
    }

    public async LoadDogBreeds() {
        if (!this._api.IsLoggedIn) {
            return;
        }

        if (!this.DogBreeds || this.DogBreeds.length === 0) {
            await this._api.Get_Dogs_Breeds().then(dogBreeds => this.DogBreeds = dogBreeds);
        }
    }

    public async LoadDogs(params: DogLookupParams): Promise<combinedQueryResult> {
        var queryParams = DogLookup.getDogSearchQueryParams(params);
        var searchResult = await this._api.Get_Dogs_Search(queryParams);
        var dogs = await this._api.Post_Dogs(searchResult.resultIds);
        var lookupResult = DogLookup.unPackResult(dogs, searchResult);

        return lookupResult;
    }

    public async LoadDogsFromQuery(query: string): Promise<combinedQueryResult> {
        var searchResult = await this._api.Run_Get_Query(query);
        var dogs = await this._api.Post_Dogs(searchResult.resultIds);
        var lookupResult = DogLookup.unPackResult(dogs, searchResult);

        return lookupResult;
    }

    public async GetMatch(dogIds: string[]): Promise<Dog | undefined> {
        var matchResult = await this._api.Post_Dogs_Match(dogIds);
        if (!matchResult.match) {
            return;
        }
        var matchDog = await this._api.Post_Dogs(matchResult.match).then(result => result[0]);
        return matchDog;
    }


    private static unPackResult(dogs: Dog[], searchResult: DogsSearchResult) {

        var combinedResult = { dogs: dogs || [], total: searchResult.total } as combinedQueryResult;
        if (searchResult.next) {combinedResult.next = searchResult.next;}
        if (searchResult.prev) {combinedResult.prev = searchResult.prev;}

        return combinedResult;
    }

    private static getDogSearchQueryParams(params: DogLookupParams): dogParams {
        var queryParams : dogParams = {};
        if (params.filter) {
            let filter = params.filter;
            if (filter.ageMax != null) {
                queryParams.ageMax = filter.ageMax;
            }
            if (filter.ageMin != null) {
                queryParams.ageMin = filter.ageMin;
            }
            if (filter.breeds && filter.breeds.length > 0) {
                queryParams.breeds = filter.breeds;
            }
            if (filter.zipCodes && filter.zipCodes.length > 0) {
                queryParams.zipCodes = filter.zipCodes;
            }
        }

        queryParams.sort = DogLookup.getDogSort(params.sort);

        if (params.size) {
            queryParams.size = params.size;
        }

        var trueSize = params.size || 25;
        if (params.page) {
            queryParams.from = params.page * trueSize;
        }


        return queryParams;

    }

    private static getDogSort(sort: GridSortModel | undefined): string {
        var activeSort = (sort || []).find(sortItems => ["name", "age", "breed"].findIndex(key => key === sortItems.field) !== -1);
        var field = activeSort?.field as keyof Dog || "breed";
        var order = activeSort?.sort || 'asc';

        return [field, order].join(":");
    }
}

type combinedQueryResult = {
    dogs: Dog[];
    total: number;
    next?: string;
    prev?: string;
};
