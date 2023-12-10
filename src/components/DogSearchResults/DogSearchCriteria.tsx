import {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import _ from 'lodash';
import DogBreedDropdown from "./DogBreedDropdown";

import {
    Dog,
    DogLookupFilter,
} from "../../api/shared/DogLookupInterfaces";
import DogAgeRangeSelector from "./DogAgeRangeSelector";
import {
    Button,
    SelectChangeEvent,
    Stack,
} from "@mui/material";
import {
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    DogLookupContext,
    ErrorContext,
} from "../../state/DogContext";
import DogMatchDisplay, {
    NoMatchFound,
} from "./DogMatchDisplay";

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
    const [dogMatch, setDogMatch] = useState<Dog>();
    const [showNoMatch, setShowNoMatch] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const errorContext = useContext(ErrorContext);
    const dogLookup = useContext(DogLookupContext);
    const updateFilterCallback = props.updateFilterCallback;

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

    async function findMatch(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        var dogIds = (props.rowSelectionModel || []).map(gridRowId => gridRowId as string);
        if (!dogIds) {
            return;
        }

        try {
            var dog = await dogLookup.GetMatch(dogIds);

            if(dog) {
                setDogMatch(dog);
            } else{
                setShowNoMatch(true);
            }
        } catch (error) {
            errorContext.HandleError(error);
        }
    }

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
          <Button onClick={findMatch} disabled={!props.rowSelectionModel || props.rowSelectionModel.length === 0}>Find Match</Button>
        </Stack>
        <DogMatchDisplay
          match={dogMatch}
          open={!!dogMatch}
          onClose={() => setDogMatch(undefined!)}/>
        <NoMatchFound open={showNoMatch} handleClose={() => { setShowNoMatch(false); }} />
      </>
    /* eslint-disable indent */
    );
}

interface DogSearchCriteriaControlProps {
    updateFilterCallback: (filterModel: DogLookupFilter) => void;
    activeSearchCriteria: DogLookupFilter;
    rowSelectionModel?: GridRowSelectionModel;
}
