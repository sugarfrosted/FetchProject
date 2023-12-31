import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Icon,
    Typography,
} from '@mui/material';
import {
    DataGrid,
    GridCallbackDetails,
    GridColDef,
    GridExpandMoreIcon,
    GridPaginationModel,
    GridRenderCellParams,
    GridRowSelectionModel,
    GridRowsProp,
    GridSortModel,
    GridValueFormatterParams,
    useGridApiRef,
} from '@mui/x-data-grid';
import {
    Dog,
    DogLookupFilter,
} from '../../api/shared/DogLookupInterfaces';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import DogImagePopover from './DogImagePopover';
import {
    ErrorContext,
} from '../../state/DogContext';
import {
    GridApiCommunity,
} from '@mui/x-data-grid/internals';
import {
    Image,
} from '@mui/icons-material';
import {
    PrettifyAge,
} from '../../utils/TextFormattingUtitilies';
import {
    useSetRecoilState,
} from 'recoil';
import {
    userLoginState,
} from '../../state/atoms';

/**Data grid that shows the dog search results */
export default function DogSearchResultsDataGrid(props: DogSearchResultsDataGridProps) {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', sortable: true, hideable: false, filterable: false, disableColumnMenu: true, flex: 2 },
        { field: 'img', headerName: 'Image', sortable: false, hideable: false, filterable: false, disableColumnMenu: true,
            renderCell: data => getDogImageAnchor(data) },
        { field: 'age', headerName: 'Age', sortable: true, hideable: false, filterable: false, disableColumnMenu: true, flex: 1,
            valueFormatter: (params: GridValueFormatterParams<number>) => PrettifyAge(params.value) },
        { field: 'zip_code', headerName: 'ZIP Code', sortable: false, hideable: false, filterable: false, disableColumnMenu: true },
        { field: 'breed', headerName: 'Breed', sortable: true, hideable: false, filterable: false, disableColumnMenu: true, flex: 2 },
    ];

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [pageModel, setPageModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});
    const [isLoading, setIsLoading] = useState(false);
    const apiRef = useGridApiRef();
    const [depictedDog, setDepictedDog] = useState<Dog | null>(null);
    const propsOnFilterModelChange = useMemo(() => props.onFilterModelChange, [props.onFilterModelChange]);
    const errorContext = useContext(ErrorContext);
    const setLoginState = useSetRecoilState(userLoginState);
    const errorCallback = useCallback(() => { setLoginState( {userName: null, email: null, loginStatus: false} );}, [setLoginState]);

    useEffect(() => {
        if (!anchorEl) {
            setDepictedDog(null);
        }
    }, [anchorEl]);


    function getDogImageAnchor(data: GridRenderCellParams) : any {
        return (<Icon><Image/></Icon>);
    }

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        const field = event.currentTarget.dataset.field! as keyof Dog | undefined;
        if (field !== 'img') {
            return;
        }
        const id = event.currentTarget.parentElement!.dataset.id!;
        const row = props.rows.find(r => r.id === id)!;
        if (row) {
            setDepictedDog(row);
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleError = useCallback(async function handleError(error: unknown) {
        if (errorContext) {
            errorContext.HandleError(error, errorCallback);
        } else {
            throw error;
        }
    }, [errorContext, errorCallback]);


    /**
     * Get the next or previous. Might need to see if this is a new load.
     * @param model
     * @param details
     */
    async function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>) {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            if (props.onPaginationModelChange) {
                let updatedPagingModel = await props.onPaginationModelChange(model, details, pageModel, apiRef.current.getSortModel());
                setPageModel(updatedPagingModel);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onFilterModelChange = useCallback(async function onFilterModelChange(model: DogLookupFilter) {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            apiRef.current.setPage(0);
            if (propsOnFilterModelChange) {
                await propsOnFilterModelChange(model, pageModel, apiRef);
            }
            setPageModel({pageSize: pageModel.pageSize, page: 0});
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiRef, propsOnFilterModelChange, handleError]);

    useEffect(() => {
        onFilterModelChange(props.filterModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.filterModel]);

    /**
     * This should keep selection but invalidate the paging model, i.e., take you to page 1.
     * @param model
     * @param details
    */
    async function onSortModelChange(model: GridSortModel, details: GridCallbackDetails<any>) {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            if (props.onSortModelChange) {
                apiRef.current.setPage(0);
                await props.onSortModelChange(model, details, pageModel);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
    /* eslint-disable indent */
      <Accordion defaultExpanded>
        <AccordionSummary
          sx={{backgroundColor: "#1976D2", color: "white"}}
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<GridExpandMoreIcon sx={{color: "white"}}/>}
        >
          <Typography>Filter Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataGrid
            checkboxSelection={true}
            keepNonExistentRowsSelected={true}
            rowCount={props.rowCount}
            rows={props.rows}
            apiRef={apiRef}
            columns={columns}
            paginationMode='server'
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            paginationModel={pageModel}
            loading={isLoading}
            onRowSelectionModelChange={props.onRowSelectionModelChange}
            rowSelectionModel={props.selection}
            sortingMode='server'
            pageSizeOptions={[5, 10, 25, 50, 100]}
            slotProps={{
              cell: {
                onMouseEnter: handlePopoverOpen,
                onMouseLeave: handlePopoverClose,
              },
            }}
          />
          <DogImagePopover open={!!anchorEl} dog={depictedDog} anchorEl={anchorEl} onClose={handlePopoverClose}/>
        </AccordionDetails>
      </Accordion>
    /* eslint-enable indent */
    );
}

export interface DogSearchResultsDataGridProps {
    onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails<any>, previousModel: GridPaginationModel, sortModel: GridSortModel) => Promise<GridPaginationModel>;
    onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails<any>, paginationModel: GridPaginationModel) => Promise<void>;
    onFilterModelChange?: (model: DogLookupFilter, pageModel: any, apiRef: React.MutableRefObject<GridApiCommunity>) => Promise<void>;
    onRowSelectionModelChange?: (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails<any>) => void;
    rows: GridRowsProp<Dog>;
    rowCount: number;
    selection?: GridRowSelectionModel;
    filterModel: DogLookupFilter;
}