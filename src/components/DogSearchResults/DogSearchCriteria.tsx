import {
    Button,
    SelectChangeEvent,
    Stack,
} from "@mui/material";
import {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import DogAgeRangeSelector from "./DogAgeRangeSelector";
import DogBreedDropdown from "./DogBreedDropdown";
import {
    DogLookupContext,
} from "../../state/DogContext";
import {
    DogLookupFilter,
} from "../../api/shared/DogLookupInterfaces";
import _ from 'lodash';

const MenuProps = {
    PaperProps: {
        style: {
            width: 250,
        },
    },
};

export default function DogSearchCriteria(props: DogSearchCriteriaControlProps) {
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [selectedAgeRange, setSelectedAgeRange] = useState<number[]>([0, 32]);
    const [isClearing, setIsClearing] = useState(false);
    const dogLookup = useContext(DogLookupContext);
    const updateFilterCallback = props.updateFilterCallback;
    const matchDisabled = useMemo(() => !!props.matchDisabled, [props.matchDisabled]);

    function clearFilter() {
        setSelectedBreeds([]);
        setSelectedAgeRange([0, 32]);
        setIsClearing(true);
    }

    const currentFilterState = useMemo(() => {
        var filter: DogLookupFilter = {};
        filter.breeds = selectedBreeds;
        {
            let ageMin = Math.min(selectedAgeRange[0], selectedAgeRange[1]);
            if (ageMin >= 0) {filter.ageMin = ageMin;}
        }
        {
            let ageMax = Math.max(selectedAgeRange[0], selectedAgeRange[1]);
            if (ageMax <= 32) {filter.ageMax = ageMax;}
        }
        return filter;

    }, [selectedBreeds, selectedAgeRange]);

    useEffect(() => {
        if (isClearing) {
            updateFilterCallback(currentFilterState);
            setIsClearing(false);
        }
    }, [isClearing, updateFilterCallback, currentFilterState]);

    useEffect(() => {
        if(dogLookup && dogLookup.IsLoggedin) {
            dogLookup.LoadDogBreeds().then(() => {
                var breeds = dogLookup?.DogBreeds || [];
                setDogBreeds(breeds);
            });
        }
    }, [dogLookup, dogLookup?.IsLoggedin]);

    const hasFilterChanges = useMemo(() => _.isEqual(props.activeSearchCriteria, currentFilterState), [currentFilterState, props.activeSearchCriteria]);

    const handleDogBreedDropdownChange = (event: SelectChangeEvent<typeof selectedBreeds>) => {
        const { target: { value } } = event;
        setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
    };

    function handleDogAgeChange(_event: Event, value: number[] | number, _activeThumb: number): void {
        var selection: number[] = typeof value === 'number' ? value = [value, value] : value;
        setSelectedAgeRange(selection);
    };

    return (
    /* eslint-disable indent */
      <>
        <DogBreedDropdown sx={{ m: 1, width: "100%", mt: 3 }}
          dogBreeds={dogBreeds}
          selectedBreeds={selectedBreeds}
          handleChange={handleDogBreedDropdownChange}
          menuProps={MenuProps}
        />
        <DogAgeRangeSelector sx={{ m: 1, width: "100%", mt: 3 }} handleChange={handleDogAgeChange} value={selectedAgeRange} />
        <Stack direction={"column"}>
          <Button onClick={() => props.updateFilterCallback(currentFilterState)}>{hasFilterChanges ? "Update Filter" : "Rerun Search"}</Button>
          <Button onClick={clearFilter}>Clear Search</Button>
          {props.findMatchClickHandler && (
            <Button onClick={props.findMatchClickHandler} disabled={matchDisabled}>Find Match</Button>)
          }
        </Stack>
      </>
    /* eslint-disable indent */
    );
}

interface DogSearchCriteriaControlProps {
    updateFilterCallback: (filterModel: DogLookupFilter) => void;
    activeSearchCriteria: DogLookupFilter;
    findMatchClickHandler?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    matchDisabled?: boolean;
}
