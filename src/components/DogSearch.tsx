import {
    SelectChangeEvent,
    Button,
    Stack,
} from "@mui/material";
import {
    MutableRefObject,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import DogSearchResultsDataGrid from "./DogSearchResults/DogSearchResultsDataGrid";
import {
    GridPaginationModel,
    GridCallbackDetails,
    GridSortModel,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Dog,
    DogLookupFilter,
    DogLookupParams,
} from "../api/shared/DogLookupInterfaces";
import {
    GridApiCommunity,
} from "@mui/x-data-grid/internals";
import DogBreedDropdown from "./DogSearchResults/DogBreedDropdown";
import {
    DogLookupContext,
    ErrorContext,
} from "../state/DogContext";
import _ from 'lodash';
import DogMatchDisplay, {
    NoMatchFound,
} from "./DogSearchResults/DogMatchDisplay";
import DogAgeRangeSelector from "./DogSearchResults/DogAgeRangeSelector";


export default function DogSearch(_props: dogSearchProps) {
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<DogLookupFilter>({});
    const [rows, setRows] = useState<Dog[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [nextPagingQuery, setNextPagingQuery] = useState<string | undefined>();
    const [prevPagingQuery, setPrevPagingQuery] = useState<string | undefined>();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();
    const [isCleared, setIsCleared] = useState(false);
    const [selectedAgeRange, setSelectedAgeRange] = useState([0, 32]);
    const [showNoMatch, setShowNoMatch] = useState(false);
    const [dogMatch, setDogMatch] = useState<Dog>();

    const dogLookup = useContext(DogLookupContext);
    const errorContext = useContext(ErrorContext);
    const filterHasChanges = useMemo(() => {
        const breedsHaveChanges = _.difference(
            _.union(selectedBreeds, activeFilter.breeds || []),
            _.intersection(selectedBreeds, activeFilter.breeds || [])
        ).length !== 0;
        const ageRangeHasChanges = (activeFilter.ageMin ?? 0) !== Math.min(selectedAgeRange[0], selectedAgeRange[1]) ||
              (activeFilter.ageMax ?? 32) !== Math.max(selectedAgeRange[0], selectedAgeRange[1]);
        return breedsHaveChanges || ageRangeHasChanges;
    }, [selectedBreeds, selectedAgeRange, activeFilter]);


    const MenuProps = {
        PaperProps: {
            style: {
                width: 250,
            },
        },
    };

    useEffect(() => {
        if(dogLookup) {
            dogLookup.LoadDogBreeds().then(() => {
                var breeds = dogLookup?.DogBreeds || [];
                setDogBreeds(breeds);
            });
        }
    }, [dogLookup, dogLookup?.IsLoggedin]);

    async function LoadDogs(sortModel: GridSortModel, pageModel: GridPaginationModel, filter?: DogLookupFilter | undefined | null) {
        var queryParams: DogLookupParams = {};
        if (filter) {
            queryParams.filter = filter;
        }
        if (sortModel && sortModel.length > 0) {
            queryParams.sort = sortModel;
        }

        queryParams.size = pageModel.pageSize;
        queryParams.page = pageModel.page;

        if(!dogLookup) {
            return;
        }

        await dogLookup.LoadDogs(queryParams).then(result => {
            setRows(result.dogs);
            setRowCount(result.total);
            setNextPagingQuery(result.next);
            setPrevPagingQuery(result.prev);
        });
    }

    async function LoadDogsFromQuery(query: string) {
        if (!dogLookup) {
            return;
        }

        await dogLookup.LoadDogsFromQuery(query).then(queryResult => {
            setRowCount(queryResult.total);
            setRows(queryResult.dogs);
            setNextPagingQuery(queryResult.next);
            setPrevPagingQuery(queryResult.prev);
        });
    }

    function updateFilterOnClick() {
        updateFilter(selectedBreeds, selectedAgeRange);
    }

    function updateFilter(selectedBreeds: string[], selectedAgeRange: number[], isClearing: boolean = false) {
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

        setActiveFilter(filter);
        setIsCleared(isClearing);
    }

    function clearFilter() {
        setSelectedBreeds([]);
        setSelectedAgeRange([0, 32]);
        updateFilter([], [0, 32], true);
        setRowSelectionModel(undefined);
    }

    const handleDogBreedDropdownChange = (event: SelectChangeEvent<typeof selectedBreeds>) => {
        const { target: { value } } = event;
        setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
    };


    async function findMatch(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        var dogIds = (rowSelectionModel || []).map(gridRowId => gridRowId as string);
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
      <div>
        <DogBreedDropdown sx={{ m: 1, width: "100%", mt: 3 }}
          dogBreeds={dogBreeds}
          selectedBreeds={selectedBreeds}
          handleChange={handleDogBreedDropdownChange}
          menuProps={MenuProps}
        />
        <DogAgeRangeSelector handleChange={handleDogAgeChange} value={selectedAgeRange} />
        <Stack direction={"column"}>
          <Button onClick={updateFilterOnClick}>{!isCleared && filterHasChanges ? "Update Filter" : "Rerun Search"}</Button>
          <Button onClick={clearFilter}>Clear Search</Button>
          <Button onClick={findMatch} disabled={!rowSelectionModel || rowSelectionModel.length === 0}>Find Match</Button>
        </Stack>
        <DogSearchResultsDataGrid
          onPaginationModelChange={onPaginationModelChange}
          onSortModelChange={onSortModelChange}
          onFilterModelChange={onFilterModelChanged}
          onRowSelectionModelChange={onRowSelectionModelChange}
          rows={rows}
          rowCount={rowCount}
          filterModel={activeFilter}
          selection={rowSelectionModel} />
        <DogMatchDisplay
          match={dogMatch}
          open={!!dogMatch}
          onClose={() => setDogMatch(undefined!)}/>
        <NoMatchFound open={showNoMatch} handleClose={() => { setShowNoMatch(false); }} />
      </div>
    /* eslint-enable indent */
    );

    function handleDogAgeChange(_event: Event, value: number[] | number, _activeThumb: number): void {
        var selection: number[] = typeof value === 'number' ? value = [value, value] : value;
        setSelectedAgeRange(selection);
    };

    async function onSortModelChange(model: GridSortModel, _details: GridCallbackDetails<any>, paginationModel: GridPaginationModel): Promise<void> {
        await LoadDogs(model, paginationModel, activeFilter);
    }

    async function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>, previousModel: GridPaginationModel, sortModel: GridSortModel): Promise<GridPaginationModel> {
        var updatedModel: GridPaginationModel = model;
        var pageSizeChanged = false;

        if (!dogLookup) {
            return previousModel;
        }

        if (previousModel.pageSize !== model.pageSize) {
            let updatedPageNumber = Math.floor(previousModel.pageSize * previousModel.page / model.pageSize);
            updatedModel = {page: updatedPageNumber, pageSize : model.pageSize} as GridPaginationModel;
            pageSizeChanged = true;
        }

        var pageDifference = updatedModel.page - previousModel.pageSize;

        if(!pageSizeChanged && pageDifference === 0) {
            return updatedModel;
        }

        var updatedData: Promise<void>;

        if (!pageSizeChanged && pageDifference === 1 && nextPagingQuery) {
            updatedData = LoadDogsFromQuery(nextPagingQuery);
        } else if (!pageSizeChanged && pageDifference === -1 && prevPagingQuery) {
            updatedData = LoadDogsFromQuery(prevPagingQuery);
        } else {
            updatedData = LoadDogs(sortModel, updatedModel, activeFilter);
        }

        await updatedData;

        return updatedModel;
    }


    async function onFilterModelChanged(model: DogLookupFilter, pageModel: GridPaginationModel, gridApiRef: MutableRefObject<GridApiCommunity>): Promise<void> {
        await LoadDogs(gridApiRef.current.getSortModel(), pageModel, model);
    }

    function onRowSelectionModelChange(rowSelectionModel: GridRowSelectionModel, _details: GridCallbackDetails<any>): void {
        setRowSelectionModel(rowSelectionModel);
    }
}

interface dogSearchProps {
}