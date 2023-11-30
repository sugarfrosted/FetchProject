import { Image } from '@mui/icons-material';
import { Icon, IconButton, Popover, SortDirection } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridInputRowSelectionModel, GridPagination, GridPaginationModel, GridRenderCellParams, GridRowId, GridRowSelectionModel, GridRowsProp, GridSortModel, GridValueFormatterParams, daDK, useGridApiRef } from '@mui/x-data-grid';
import { ForwardedRef, MouseEventHandler, useEffect, useImperativeHandle, useState } from 'react';
import { Interface } from 'readline';
import { Dog } from '../../api/shared/interfaces';
import DogLookup, { DogLookupFilter, DogLookupParams } from '../../api/data/DogLookup';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

export default function DogSearchResultsDataGrid(props: DogSearchResultsDataGridProps) {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, flex: 1 },
        { field: 'img', headerName: 'Image', sortable: false, hideable: false ,filterable: false, disableColumnMenu: true, renderCell: (data) => getDogImageAnchor(data) },
        { field: 'age', headerName: 'Age', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, },
        { field: 'zip_code', headerName: 'ZIP Code', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, },
        { field: 'breed', headerName: 'Breed', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, flex: 1},
    ];
    const paginationModel: GridPaginationModel = {
        pageSize: 25,
        page: 0,
    };

    const [anchorEl, setAnchorEl] = useState<Element|null>(null);
    const [pageModel, setPageModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});
    const apiRef = useGridApiRef();
    // const [rowCount, setRowCount] = useState(0);
    // const [rows, setRows] = useState<GridRowsProp<Dog>>([]);

    useEffect(() => {
        onFilterModelChange(props.filterModel || {});
    }, [props.filterModel])


    // async function loadSelectionHandler() {
    //     // Gather params
    //     var params : DogLookupParams = {
    //         sort: sortModel,
    //         page: paginationModel.page,
    //         size: paginationModel.pageSize,
    //         filter: {},
    //     }
        
    //     return await props.dataLoadingHandler(params)
    // }

    // useEffect(() => { if(ref.current) {
    //     ref.current.sortKey = sortKey;
    // }},[sortKey, ref.current]);


    function getDogImageAnchor(data: GridRenderCellParams) : any {
        return <IconButton onMouseOver={imageMouseEventHandler} onMouseLeave={imageMouseEventHandler} onClick={imageMouseEventHandler}><Image/></IconButton>
    }

    const imageMouseEventHandler: MouseEventHandler<HTMLButtonElement> = 
        function ImageMouseEventHandler(event: React.MouseEvent<HTMLButtonElement>) {
            console.log(event);
        } 


    /**
     * Get the next or previous. Might need to see if this is a new load.
     * @param model 
     * @param details 
     */
    function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>): void {
        
    }

    async function onFilterModelChange(model: DogLookupFilter)
    {
        await clearSortModel();
        await setToFirstPage();
        if (props.onFilterModelChange) {
            await props.onFilterModelChange(model, pageModel, apiRef)
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
    function onSortModelChange(model: GridSortModel, details: GridCallbackDetails<any>): void {
        throw new Error('Function not implemented.');
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
       onPaginationModelChange={props.onPaginationModelChange}
       onSortModelChange={props.onSortModelChange}
       paginationModel={pageModel}
       loading={false}
       sortingMode='server'
       autoHeight
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

// update filter: clear the paging state to default. Clear the sort state and set to default.
// update paging: don't change anything else.
// update sort: clear the paging state and set to default



export interface DogSearchResultsDataGridProps {
    onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails<any>) => void;
    onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails<any>) => void;
    onFilterModelChange?: (model: DogLookupFilter, pageModel: any, apiRef: React.MutableRefObject<GridApiCommunity>) => void;
    rows: GridRowsProp<Dog>;
    rowCount: number;
    selection?: GridRowSelectionModel;
    filterModel?: DogLookupFilter;
}
