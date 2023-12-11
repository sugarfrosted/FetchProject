import data from './states.json';

export const UsStates = data.US;
export const CaProvinces = data.CA;

export interface StateData {
    name: string;
    divisions: {name: string, abbr: string}[];
}