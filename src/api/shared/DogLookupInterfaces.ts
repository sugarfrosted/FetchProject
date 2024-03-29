import {
    GridSortModel,
} from "@mui/x-data-grid";

export interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

export interface DogsSearchResult {
    resultIds: string[];
    /** Number of results based on the search query, capped at 10,000 */
    total: number;
    /** Query for the next page of results */
    next?: string;
    /** Query for the previous page of results */
    prev?: string;
}

export interface Match {
    match?: string;
}

export interface DogLookupFilter {
    zipCodes?: string[] | undefined;
    breeds?: string[] | undefined;
    ageMax?: number | undefined;
    ageMin?: number | undefined;
}

export interface DogLookupParams {
    filter?: DogLookupFilter;
    sort?: GridSortModel | undefined;
    size?: number | undefined,
    page?: number | undefined
}

