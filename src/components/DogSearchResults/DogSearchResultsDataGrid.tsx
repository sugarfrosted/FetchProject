import { Image } from '@mui/icons-material';
import { Icon, IconButton, Popover, SortDirection } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridInputRowSelectionModel, GridPaginationModel, GridRenderCellParams, GridRowId, GridRowsProp, GridSortModel, GridValueFormatterParams, daDK, useGridApiRef } from '@mui/x-data-grid';
import { ForwardedRef, MouseEventHandler, useEffect, useImperativeHandle, useState } from 'react';
import { Interface } from 'readline';
import { Dog } from '../../api/shared/interfaces';
import DogLookup, { DogLookupParams } from '../../api/data/DogLookup';

export default function DogSearchResultsDataGrid(props: DogSearchResultsDataGridProps, ref: ForwardedRef<DogSearchResultsDataGridRef | undefined>) {
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
    const [sortKey, setSortKey] = useState<keyof Dog | undefined>();
    const [sortModel, setSortModel] = useState();
    const apiRef = useGridApiRef();
    const [rowCount, setRowCount] = useState(0);
    const [rows, setRows] = useState<GridRowsProp<Dog>>([]);

    useImperativeHandle(ref, () => ({
        sortKey: sortKey || 'name',
        clearSelection: async () => {},
        loadSelection: async () => {},
    }))

    function loadSelectionHandler() {
        // Gather params
        var params : DogLookupParams = {
            sort: sortModel,
            page: paginationModel.page,
            size: paginationModel.pageSize,
            filter: {},
        }
        
        return props.dataLoadingHandler(params)
    }

    // useEffect(() => {
    //     ref = {
    //         clearSelection: async () => { return;},
    //         sortKey: sortKey || 'name'
    //     }
    // }, [ref])

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
        console.log(model); console.log(details);
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
       rowCount={rowCount}
       rows={rows}
       apiRef={apiRef}
       columns={columns}
       paginationMode='server'
       paginationModel={paginationModel}
       onPaginationModelChange={onPaginationModelChange}
       onSortModelChange={onSortModelChange}
       loading={false}
       sortingMode='server'
       sortModel={sortModel}
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



export interface DogSearchResultsDataGridProps {
    onPaginationModelChange: (model: GridPaginationModel, details: GridCallbackDetails<any>) => void;
    onSortModelChange: (model: GridSortModel, details: GridCallbackDetails<any>) => void;
    dataLoadingHandler: (params: DogLookupParams) => Promise<{ dogs: Dog[]; total: number; } | undefined>;
}

export interface DogSearchResultsDataGridRef {
    clearSelection: () => Promise<void>;
    loadSelection: () => Promise<void>;
    sortKey: keyof Dog | undefined;
}