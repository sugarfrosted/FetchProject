import data from './states.json';

const Countries: {[value: string]: CountryData} = data;
export default Countries;
export const UsStates: CountryData = data.US;
export const CaProvinces: CountryData = data.CA;

export interface CountryData {
    name: string;
    abbr: string;
    divisions: {name: string, abbr: string}[];
}