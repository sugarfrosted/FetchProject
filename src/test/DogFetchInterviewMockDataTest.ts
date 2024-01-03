import DogFetchInterviewApiMockData from "../api/data/DogFetchInterviewApiMockData";
import { dogParams, } from "../api/shared/IDogFetchInterviewApi";

export default class DogFetchInterviewApiMockDataTest extends DogFetchInterviewApiMockData {

    public static GetSharesStatesFunctionForTest(states: string[]) {
        return super.getSharesStatesFunction(states);
    }

    public static GetFilterFunctionForTest(params: dogParams) {
        return super.GetFilterFunction(params);
    }
}