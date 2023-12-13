import data from './states.json';

const Countries: {[value: string]: CountryData} = data;

/**
 * Data for both US and Canada, these are divided into an object indexed by the abbrevation.
 */
export default Countries;

/**
 * US State data.
 */
export const UsStates: CountryData = data.US;

/**
 * Canadian province data.
 */
export const CaProvinces: CountryData = data.CA;

/** Country data format. Including country and administrative names and abbreviations. */
export interface CountryData {
    name: string;
    abbr: string;
    divisions: {name: string, abbr: string}[];
}