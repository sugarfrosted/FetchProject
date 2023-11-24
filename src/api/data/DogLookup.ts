import { useEffect } from "react";
import DogFetchInterviewApi from "../shared/DogFetchInterviewApi";
import { Api } from "@mui/icons-material";

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

}