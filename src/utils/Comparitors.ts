import { DogLookupFilter, } from "../api/shared/DogLookupInterfaces";

export default class Comparitors {
    static AreDogLookupFiltersEqual(first: DogLookupFilter | undefined, second: DogLookupFilter | undefined): boolean {

        if (!first && !second) {
            return true;
        } else if (!first || !second) {
            return false;
        }

        if (first.ageMin !== second.ageMin || first.ageMax !== second.ageMax) {
            return false;
        }

        // Hey, it's xnor!
        if (!first.breeds !== !second.breeds) {
            return false;
        }

        if (first.breeds?.length !== second.breeds?.length) {
            return false;
        }

        if (!first.zipCodes !== !second.zipCodes) {
            return false;
        }

        if (first.zipCodes?.length !== second.breeds?.length) {
            return false;
        }

        if (first.breeds?.sort().join('\x1f') !== second.breeds?.sort().join('\x1f')) {
            return false;
        }

        if (first.zipCodes?.sort().join('\x1f') !== second.zipCodes?.sort().join('\x1f')) {
            return false;
        }

        return true;

    }
}