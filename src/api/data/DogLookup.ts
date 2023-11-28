import DogFetchInterviewApi, { dogParams } from "../shared/DogFetchInterviewApi";
import { Dog } from "../shared/interfaces";
import { GridSortModel } from "@mui/x-data-grid";

export default class DogLookup {
    private _api : DogFetchInterviewApi;

    private _dogBreeds : string[] = [];

    public get DogBreeds() {
        return this._dogBreeds;
    }
    private set DogBreeds(value) {
        this._dogBreeds = value;
    }

    public get IsLoggedin() { return this._api.IsLoggedIn; }

    constructor(api: DogFetchInterviewApi) {
        this._api = api;
    }
    
    public async LoadDogBreeds() {
        if (!this._api.IsLoggedIn) {
            return;
        }

        if (!this.DogBreeds || this.DogBreeds.length === 0)
        {
            await this._api.Get_Dogs_Breeds().then((dogBreeds) => this.DogBreeds = dogBreeds);
        }
    }

    public async LoadDogs(params: DogLookupParams): Promise<{ dogs: Dog[]; total: number; }> {
        var queryParams = this.getDogSearchQueryParams(params);
        var searchResult = await this._api.Get_Dogs_Search(queryParams);
        var dogs = await this._api.Post_Dogs(searchResult.resultIds)
        var lookupResult = {dogs: dogs || [], total: searchResult.total}

        return lookupResult;
    }

    private getDogSearchQueryParams(params: DogLookupParams): dogParams
    {
        var queryParams : dogParams = {};
        if (params.filter) {
            let filter = params.filter;
            if (filter.ageMax != null)
            {
                queryParams.ageMax = filter.ageMax;
            }
            if (filter.ageMin != null)
            {
                queryParams.ageMin = filter.ageMin;
            }
            if (filter.breeds && filter.breeds.length > 0)
            {
                queryParams.breeds = filter.breeds;
            }
            if (filter.zipCodes && filter.zipCodes.length > 0)
            {
                queryParams.zipCodes = filter.zipCodes;
            }
        }

        // We don't support multisort, but the grid api assumes it.
        let sortItem = this.getDogSort(params.sort);
        if (sortItem)
        {
            queryParams.sort = sortItem.field as keyof Dog;
            if (sortItem.sort) queryParams.sortDirection = sortItem.sort;
        }

        if (params.size)
        {
            queryParams.size = params.size
        }

        var trueSize = params.size || 25;
        if (params.page)
        {
            queryParams.from = params.page * trueSize;
        }


        return queryParams;

    }

    /** This is basically impossible to find documentation for. I suspect this is overkill but I don't know how to do it otherwise! :( */
    private getDogSort(sort: GridSortModel | undefined) 
    {
        if (!sort || !sort.length)
        {
            return undefined;
        }

        var activeSort = sort.find(x => x.field in ["img", "name", "age", "zip_code", "breed"])
        if (activeSort)
        {
            return activeSort;
        }

        return undefined;
    }


}

export interface DogLookupParams
{
    filter?: {
        zipCodes?: string[]| undefined,
        breeds?: string[] | undefined,
        ageMax?: number | undefined,
        ageMin?: number | undefined,
    };
    sort?: GridSortModel | undefined;
    size?: number | undefined,
    page?: number | undefined
}