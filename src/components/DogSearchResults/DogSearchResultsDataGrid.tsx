import { Image } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridRenderCellParams, GridRowSelectionModel, GridRowsProp, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import { MutableRefObject, useEffect, useState } from 'react';
import { Dog } from '../../api/shared/interfaces';
import { DogLookupFilter } from '../../api/data/DogLookup';
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
 
    useEffect(() => {
        onFilterModelChange(props.filterModel);
    }, [props.filterModel])


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
        if (props.onPaginationModelChange)
        {
            let updatedPagingModel = await props.onPaginationModelChange(model, details, pageModel, apiRef.current.getSortModel());
            setPageModel(updatedPagingModel);
        }
        setIsLoading(false);
        
    }

    async function onFilterModelChange(model: DogLookupFilter)
    {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            await clearSortModel();
            await setToFirstPage();
            if (props.onFilterModelChange) {
                await props.onFilterModelChange(model, pageModel, apiRef)
            }
            setPageModel({pageSize: pageModel.pageSize, page: 0})
        } catch (error) {
            
        }
        finally {
            setIsLoading(false);
        }
    }

    async function clearSortModel() {
        apiRef.current.setSortModel([]);
    }

    async function setToFirstPage() {
        apiRef.current.setPage(0);
    }


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
                await setToFirstPage();
                await props.onSortModelChange(model, details, pageModel)
            }
        }
        catch { }
        finally
        {
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
    rows: GridRowsProp<Dog>;
    rowCount: number;
    selection?: GridRowSelectionModel;
    filterModel: DogLookupFilter;
}