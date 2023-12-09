import {
    Image
} from '@mui/icons-material';
import {
    IconButton,
    Popover
} from '@mui/material';
import {
    DataGrid,
    GridCallbackDetails,
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams,
    GridRowSelectionModel,
    GridRowsProp,
    GridSortModel,
    GridValueFormatterParams,
    useGridApiRef,
} from '@mui/x-data-grid';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Dog,
    DogLookupFilter,
} from '../../api/shared/DogLookupInterfaces';
import {
    GridApiCommunity,
} from '@mui/x-data-grid/internals';
import {
    ErrorContext,
} from '../../state/DogContext';
import {
    useSetRecoilState,
} from 'recoil';
import {
    userLoginState,
} from '../../state/atoms';
import {
    PrettifyAge,
} from '../../utils/TextFormattingUtitilies';

export default function DogSearchResultsDataGrid(props: DogSearchResultsDataGridProps) {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', sortable: true, hideable: false, filterable: false, disableColumnMenu: true, flex: 1 },
        { field: 'img', headerName: 'Image', sortable: false, hideable: false, filterable: false, disableColumnMenu: true, renderCell: data => getDogImageAnchor(data) },
        { field: 'age', headerName: 'Age', sortable: true, hideable: false, filterable: false, disableColumnMenu: true,
            valueFormatter: (params: GridValueFormatterParams<number>) => PrettifyAge(params.value)},
        { field: 'zip_code', headerName: 'ZIP Code', sortable: false, hideable: false, filterable: false, disableColumnMenu: true },
        { field: 'breed', headerName: 'Breed', sortable: true, hideable: false, filterable: false, disableColumnMenu: true, flex: 1 },
    ];

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [pageModel, setPageModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});
    const [isLoading, setIsLoading] = useState(false);
    const apiRef = useGridApiRef();
    const [dogImageUrl, setDogImageUrl] = useState("");
    const propsOnFilterModelChange = useMemo(() => props.onFilterModelChange, [props.onFilterModelChange]);
    const errorContext = useContext(ErrorContext);
    const setLoginState = useSetRecoilState(userLoginState);
    const errorCallback = useCallback(() => { setLoginState( {userName: null, email: null, loginStatus: false} );}, [setLoginState]);


    function getDogImageAnchor(data: GridRenderCellParams) : any {
        // var handlePopoverOpen = getHandlePopoverOpen(data.value)
        // return <IconButton onClick={handlePopoverOpen} onMouseLeave={handlePopoverClose}><Image/></IconButton>
    }

    const getHandlePopoverOpen = (url: string ) => {
        return (event: React.MouseEvent<HTMLElement>) => {
            setDogImageUrl(url);
            setAnchorEl(event.currentTarget);
        };
    };

    const handlePopoverClose = () => {
    //setAnchorEl(null);
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
      <>
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
          autoHeight
          pageSizeOptions={[5, 10, 25, 50]}
        />
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={!!anchorEl}
          anchorEl={anchorEl}
        >
          The content of the Popover.
        </Popover>
      </>
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