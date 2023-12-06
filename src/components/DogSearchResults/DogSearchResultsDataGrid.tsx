import { Image } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRenderCellParams, GridRowSelectionModel, GridRowsProp, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dog, DogLookupFilter } from '../../api/shared/DogLookupInterfaces';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

export default function DogSearchResultsDataGrid(props: DogSearchResultsDataGridProps) {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, flex: 1 },
        { field: 'img', headerName: 'Image', sortable: false, hideable: false ,filterable: false, disableColumnMenu: true, renderCell: (data) => getDogImageAnchor(data) },
        { field: 'age', headerName: 'Age', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, },
        { field: 'zip_code', headerName: 'ZIP Code', sortable: false, hideable: false ,filterable: false, disableColumnMenu: true, },
        { field: 'breed', headerName: 'Breed', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, flex: 1},
    ];

    const [anchorEl, setAnchorEl] = useState<Element|null>(null);
    const [pageModel, setPageModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});
    const [isLoading, setIsLoading] = useState(false);
    const apiRef = useGridApiRef();
    const [dogImageUrl, setDogImageUrl] = useState("");
    const propsOnFilterModelChange = useMemo(() => props.onFilterModelChange, [props.onFilterModelChange]);
    const propsOnDataLookupError = useMemo(() => props.onDataLookupError, [props.onDataLookupError]);
 


    function getDogImageAnchor(data: GridRenderCellParams) : any {
        // var handlePopoverOpen = getHandlePopoverOpen(data.value)
        // return <IconButton onClick={handlePopoverOpen} onMouseLeave={handlePopoverClose}><Image/></IconButton>
    }

    const getHandlePopoverOpen = (url: string ) =>
    {
      return (event: React.MouseEvent<HTMLElement>) => {
        setDogImageUrl(url);
        setAnchorEl(event.currentTarget);
      };
    }
    
      const handlePopoverClose = () => {
        //setAnchorEl(null);
      };

    /**
     * Get the next or previous. Might need to see if this is a new load.
     * @param model 
     * @param details 
     */
    async function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>) {
        if (isLoading)
        {
            return;
        }

        setIsLoading(true);

        try {
            if (props.onPaginationModelChange)
            {
                let updatedPagingModel = await props.onPaginationModelChange(model, details, pageModel, apiRef.current.getSortModel());
                setPageModel(updatedPagingModel);
            }
        } catch (error) {
            if (propsOnDataLookupError)
            {
                propsOnDataLookupError(error);
            }
            else
            {
                throw error;
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onFilterModelChange = useCallback(async function onFilterModelChange(model: DogLookupFilter, isLoading: boolean, pageModel: GridPaginationModel)
    {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            apiRef.current.setSortModel([]);
            apiRef.current.setPage(0);
            if (propsOnFilterModelChange) {
                await propsOnFilterModelChange(model, pageModel, apiRef)
            }
            setPageModel({pageSize: pageModel.pageSize, page: 0})
        } catch (error) {
            if (propsOnDataLookupError)
            {
                await propsOnDataLookupError(error);
            }
            else
            {
                throw error;
            }
        } finally {

            setIsLoading(false);
        }
    },[apiRef, propsOnFilterModelChange, propsOnDataLookupError])

    useEffect(() => {
        onFilterModelChange(props.filterModel, isLoading, pageModel);
    }, [props.filterModel])

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
                await props.onSortModelChange(model, details, pageModel)
            }
        } catch (error) {
            if (propsOnDataLookupError)
            {
                propsOnDataLookupError(error);
            }
            else
            {
                throw error;
            }
        } finally {
            setIsLoading(false);
        }
    }

    return ( <>
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
        }} open={!!anchorEl}
        anchorEl={anchorEl}
    >
    The content of the Popover.
    </Popover>
    </>);
}


export interface DogSearchResultsDataGridProps {
    onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails<any>, previousModel: GridPaginationModel, sortModel: GridSortModel) => Promise<GridPaginationModel>;
    onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails<any>, paginationModel: GridPaginationModel) => Promise<void>;
    onFilterModelChange?: (model: DogLookupFilter, pageModel: any, apiRef: React.MutableRefObject<GridApiCommunity>) => Promise<void>;
    onRowSelectionModelChange?: (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails<any>) => void;
    onDataLookupError?: (error: any) => Promise<void>;
    rows: GridRowsProp<Dog>;
    rowCount: number;
    selection?: GridRowSelectionModel;
    filterModel: DogLookupFilter;
}