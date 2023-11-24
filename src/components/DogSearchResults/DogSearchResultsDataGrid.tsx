import { Image } from '@mui/icons-material';
import { Icon, IconButton, Popover } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridInputRowSelectionModel, GridPaginationModel, GridRenderCellParams, GridRowId, GridRowsProp, GridValueFormatterParams } from '@mui/x-data-grid';
import { MouseEventHandler, useState } from 'react';

export default function DogSearchResultsDataGrid() {
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, flex: 1 },
        { field: 'img', headerName: 'Image', sortable: false, hideable: false ,filterable: false, disableColumnMenu: true, renderCell: (data) => getDogImageAnchor(data) },
        { field: 'age', headerName: 'Age', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, },
        { field: 'zip_code', headerName: 'ZIP Code', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, },
        { field: 'breed', headerName: 'Breed', sortable: true, hideable: false ,filterable: false, disableColumnMenu: true, flex: 1},
    ];
    const rows: GridRowsProp = [
        { id: 1, name: 'Hello', age: 27, img: "aaaaa" },
        { id: 2, name: 'Hello', age: 27 },
        { id: 3, name: 'Hello', age: 27 },
    ];
    const paginationModel: GridPaginationModel = {
        pageSize: 25,
        page: 0,
    };

    const [anchorEl, setAnchorEl] = useState<Element|null>(null);
    const [imageLocked, setImageLocked] = useState<boolean>(false)
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);

    function getDogImageAnchor(data: GridRenderCellParams) : any {
        return <IconButton onMouseOver={imageMouseEventHandler} onMouseLeave={imageMouseEventHandler} onClick={imageMouseEventHandler}><Image/></IconButton>
    }

    const imageMouseEventHandler: MouseEventHandler<HTMLButtonElement> = 
        function ImageMouseEventHandler(event: React.MouseEvent<HTMLButtonElement>) {
            console.log(event);
        } 


    function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>): void {
        console.log(model); console.log(details)
    }


    return ( <>
    <DataGrid rowSelectionModel={rowSelectionModel} checkboxSelection={true} rowCount={500} columns={columns} rows={rows} paginationMode='server' paginationModel={paginationModel} onPaginationModelChange={onPaginationModelChange}/>);
    <Popover 
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }} open={!!anchorEl}
        anchorEl={anchorEl}>
    The content of the Popover.
    </Popover>
    </>);


}