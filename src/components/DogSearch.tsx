import {
    Dog,
    DogLookupFilter,
    DogLookupParams,
} from "../api/shared/DogLookupInterfaces";
import {
    DogLookupContext,
    ErrorContext,
} from "../state/DogContext";
import DogMatchDisplay, {
    DogMatchButtonIds,
} from "./DogSearchResults/DogMatchDisplay";
import {
    GridCallbackDetails,
    GridPaginationModel,
    GridRowSelectionModel,
    GridSortModel,
} from "@mui/x-data-grid";
import {
    MutableRefObject,
    useContext,
    useState,
} from "react";
import DogSearchCriteria from "./DogSearchResults/DogSearchCriteria";
import DogSearchResultsDataGrid from "./DogSearchResults/DogSearchResultsDataGrid";
import {
    GridApiCommunity,
} from "@mui/x-data-grid/internals";


export default function DogSearch(_props: dogSearchProps) {
    const [activeFilter, setActiveFilter] = useState<DogLookupFilter>({});
    const [rows, setRows] = useState<Dog[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [nextPagingQuery, setNextPagingQuery] = useState<string | undefined>();
    const [prevPagingQuery, setPrevPagingQuery] = useState<string | undefined>();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();
    const [dogMatch, setDogMatch] = useState<Dog>();
    const [showMatchPopup, setShowMatchPopup] = useState(false);

    const dogLookup = useContext(DogLookupContext);
    const errorContext = useContext(ErrorContext);


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

    return (
    /* eslint-disable indent */
      <div>
        <DogSearchCriteria
          updateFilterCallback={(filterModel: DogLookupFilter, isClearing: boolean = false) => {
            setActiveFilter(filterModel);
            if (isClearing) {
              setRowSelectionModel([]);
            }
          }}
          activeSearchCriteria={activeFilter}
          findMatchClickHandler={findMatch}
          matchDisabled={!rowSelectionModel || rowSelectionModel.length === 0}
        />
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
          open={showMatchPopup}
          onClose={onCloseDogMatchPopup}
          sx={{maxHeight: "50em", flexGrow: 1}} />
      </div>
    /* eslint-enable indent */
    );

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

    async function findMatch(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        var dogIds = (rowSelectionModel || []).map(gridRowId => gridRowId as string);
        if (!dogIds) {
            return;
        }

        try {
            var dog = await dogLookup.GetMatch(dogIds);

            setDogMatch(dog);
            setShowMatchPopup(true);
        } catch (error) {
            errorContext.HandleError(error);
        }
    }

    function onCloseDogMatchPopup(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        console.log(_event);
        var temp = 'btnCloseNoMatchFound' as DogMatchButtonIds;
        switch (temp) {
        case 'btnCloseNoMatchFound':
        case 'btnCloseSearchResult':
            setDogMatch(undefined);
            setShowMatchPopup(false);
            return;
        default:
            throw new Error(`Button type: ${temp} not supported`);
        }
    }
}

interface dogSearchProps {
}