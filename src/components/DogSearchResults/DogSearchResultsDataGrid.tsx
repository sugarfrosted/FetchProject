import { Image } from '@mui/icons-material';
import { Icon, IconButton, Popover, SortDirection } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridInputRowSelectionModel, GridPaginationModel, GridRenderCellParams, GridRowId, GridRowsProp, GridSortModel, GridValueFormatterParams, useGridApiRef } from '@mui/x-data-grid';
import { ForwardedRef, MouseEventHandler, useEffect, useImperativeHandle, useState } from 'react';
import { Interface } from 'readline';
import { Dog } from '../../api/shared/interfaces';

export default function DogSearchResultsDataGrid(props: DogSearchResultsDataGridProps2, ref: ForwardedRef<DogSearchResultsDataGridRef | undefined>) {
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
    const apiRef = useGridApiRef();

    useImperativeHandle(ref, () => ({
        sortKey: sortKey || 'name',
        clearSelection: async () => {},
        loadSelection: async () => {},
    }))

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
       rowCount={props.rowCount}
       rows={props.rows}
       apiRef={apiRef}
       columns={columns}
       paginationMode='server'
       paginationModel={paginationModel}
       onPaginationModelChange={onPaginationModelChange}
       onSortModelChange={onSortModelChange}
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



export interface DogSearchResultsDataGridProps2 {
    rows: GridRowsProp<Dog>;
    rowCount: number;
    onPaginationModelChange: (model: GridPaginationModel, details: GridCallbackDetails<any>) => void;
    onSortModelChange: (model: GridSortModel, details: GridCallbackDetails<any>) => void;
    dataLoadingHandler: (sortkey: keyof Dog | undefined, sortOrder: SortDirection, page: number, pageSize: number) => void;
    // ref: React.MutableRefObject<DogSearchResultsDataGridRef | undefined>;
}

interface DogSearchResultsDataGridProps extends DogSearchResultsDataGridProps2 {
    ref: any;
}

export interface DogSearchResultsDataGridRef {
    clearSelection: () => Promise<void>;
    loadSelection: () => Promise<void>;
    sortKey: keyof Dog | undefined;
}