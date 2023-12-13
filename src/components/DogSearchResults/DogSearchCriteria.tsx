import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Grid,
    SelectChangeEvent,
    Stack,
    Typography,
} from "@mui/material";
import {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import DogAgeRangeSelector from "./DogAgeRangeSelector";
import DogBreedDropdown from "./DogBreedDropdown";
import DogLocationSearch from "./DogLocationSearch";
import {
    DogLookupContext,
} from "../../state/DogContext";
import {
    DogLookupFilter,
} from "../../api/shared/DogLookupInterfaces";
import {
    GridExpandMoreIcon,
} from "@mui/x-data-grid";
import Settings from "../../Configuration.json";
import _ from 'lodash';

const MenuProps = {
    PaperProps: {
        style: {
            width: 250,
        },
    },
};

/**Control to show the criteria for the dog search closed in an accordion to give more room for the results. */
export default function DogSearchCriteria(props: DogSearchCriteriaControlProps) {
    const locationSearchRef = useRef<{clear: () => void}>(null);
    const dogLookup = useContext(DogLookupContext);
    const updateFilterCallback = props.updateFilterCallback;
    const matchDisabled = useMemo(() => !!props.matchDisabled, [props.matchDisabled]);
    const max_age = useMemo(() => {
        var maxAge = ((Settings.DOG_SEARCH) && (Settings.DOG_SEARCH.MAX_AGE)) || 0;
        return maxAge < 10 ? 10 : maxAge;
    }, []);
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [selectedAgeRange, setSelectedAgeRange] = useState<number[]>([0, max_age]);
    const [isClearing, setIsClearing] = useState(false);
    const [zipCodes, setZipCodes] = useState<string[]>([]);

    async function clearFilter() {
        setSelectedBreeds([]);
        setSelectedAgeRange([0, max_age]);
        setZipCodes([]);
        if (locationSearchRef.current) {
            locationSearchRef.current.clear();
        }
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
            if (ageMax <= max_age) {filter.ageMax = ageMax;}
        }
        if (zipCodes && zipCodes.length !== 0) {
            filter.zipCodes = zipCodes;
        }
        return filter;

    }, [selectedBreeds, selectedAgeRange, max_age, zipCodes]);

    useEffect(() => {
        if (isClearing) {
            updateFilterCallback(currentFilterState, true);
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

    const hasFilterChanges = useMemo(
        () => !_.isEqual(props.activeSearchCriteria, currentFilterState),
        [currentFilterState, props.activeSearchCriteria]);

    const handleDogBreedDropdownChange = (event: SelectChangeEvent<typeof selectedBreeds>) => {
        const { target: { value } } = event;
        setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
    };

    function handleDogAgeChange(_event: Event, value: number[] | number, _activeThumb: number): void {
        var selection: number[] = typeof value === 'number' ? value = [value, value] : value;
        setSelectedAgeRange(selection);
    };

    function onAccordionExpansionChange(_event: React.SyntheticEvent, isExpanded: boolean) {
        if (!isExpanded && hasFilterChanges) {
            updateFilterCallback(currentFilterState);
        }
    }

    return (
    /* eslint-disable indent */
      <Accordion defaultExpanded onChange={onAccordionExpansionChange}>
        <AccordionSummary sx={{backgroundColor: "#1976D2", color: "white"}} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<GridExpandMoreIcon sx={{color: "white"}}/>}>
          <Typography>Filter Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} paddingX={2}>
            <Grid item xs={6} >
              <DogBreedDropdown
                sx={{ m: 1, mt: 3 }}
                fullWidth
                dogBreeds={dogBreeds}
                selectedBreeds={selectedBreeds}
                handleChange={handleDogBreedDropdownChange}
                menuProps={MenuProps}
              />
            </Grid>
            <Grid item xs={6} >
              <DogAgeRangeSelector sx={{ m: 1, mt: 3}} fullWidth handleChange={handleDogAgeChange} value={selectedAgeRange} />
            </Grid>
            <Grid item xs={6} >
              <DogLocationSearch ref={locationSearchRef} zipCodes={zipCodes} onZipChange={(zipCodes: string[]) => setZipCodes(zipCodes)} />
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Stack direction={"row"}>
            <Button onClick={() => props.updateFilterCallback(currentFilterState)}>{hasFilterChanges ? "Update Filter" : "Rerun Search"}</Button>
            <Button onClick={clearFilter}>Clear Search</Button>
            {props.findMatchClickHandler && (
              <Button onClick={props.findMatchClickHandler} disabled={matchDisabled}>Find Match</Button>)
            }
          </Stack>
        </AccordionActions>
      </Accordion>
    /* eslint-disable indent */
    );
}

interface DogSearchCriteriaControlProps {
    updateFilterCallback: (filterModel: DogLookupFilter, isClearing?: boolean) => void;
    activeSearchCriteria: DogLookupFilter;
    findMatchClickHandler?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    matchDisabled?: boolean;
}
