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
    total: number;
    next?: string;
    prev?: string;
}

export interface Match {
    match: string
}