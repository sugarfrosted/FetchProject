import { SelectChangeEvent, Button, Stack } from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import DogLookup, { DogLookupFilter, DogLookupParams } from "../api/data/DogLookup";
import DogSearchResultsDataGrid from "./DogSearchResults/DogSearchResultsDataGrid";
import { GridPaginationModel, GridCallbackDetails, GridSortModel } from "@mui/x-data-grid";
import { Dog } from "../api/shared/interfaces";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import DogBreedDropdown from "./DogSearchResults/DogBreedDropdown";

export default function DogSearch(props: dogSearchProps) {
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<DogLookupFilter>({})
    const [rows, setRows] = useState<Dog[]>([])
    const [rowCount, setRowCount] = useState<number>(0)
    const pagingQueries : MutableRefObject<PagingQueries> = useRef({});


    const MenuProps = {
      PaperProps: {
        style: {
          // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    useEffect(() => {
        if(props.dogLookup) {
          props.dogLookup.LoadDogBreeds().then(() => {
            var breeds = props.dogLookup?.DogBreeds || [];
            setDogBreeds(breeds);
          })}
    }, [props.dogLookup, props.dogLookup?.IsLoggedin])

    useEffect(() => {}, [activeFilter])

  async function LoadDogs(sortModel: GridSortModel, pageModel: GridPaginationModel, filter?: DogLookupFilter | undefined | null) {
    var queryParams: DogLookupParams = {};
    if (filter) {
      queryParams.filter = filter;
    }
    if (sortModel && sortModel.length > 0) {
      queryParams.sort = sortModel;
    }
    else {
    }

    queryParams.size = pageModel.pageSize;
    queryParams.page = pageModel.page;

    if(props.dogLookup) {
      await props.dogLookup.LoadDogs(queryParams).then(result => {
        setRows(result.dogs);
        setRowCount(result.total);
      });
    }
  }

  async function LoadDogsFromQuery(query: string)
  {
    if (!props.dogLookup)
    {
      return;
    }

    var queryResult = await props.dogLookup.LoadDogsFromQuery(query);

    setRowCount(queryResult.total);
    setRows(queryResult.dogs);
    pagingQueries.current.next = queryResult.nextQuery;
    pagingQueries.current.prev = queryResult.prevQuery;
  }

  function updateFilter() {
    var filter: DogLookupFilter = {}
    if (selectedBreeds && selectedBreeds.length > 0)
    {
      filter.breeds = selectedBreeds;
    }

    setActiveFilter(filter);
  }

  const handleDogBreedDropdownChange = (event: SelectChangeEvent<typeof selectedBreeds>) => {
    const { target: { value }, } = event;
    setSelectedBreeds(typeof value === 'string' ? value.split(',') : value)
  };


  return (
    <div>
      <DogBreedDropdown sx={{ m: 1, width: "100%", mt: 3 }}
        dogBreeds={dogBreeds}
        selectedBreeds={selectedBreeds}
        handleChange={handleDogBreedDropdownChange}
        menuProps={MenuProps}/>
      <Stack direction={"column"}>
        {/* <Button onClick={LoadDogs} >Load Search</Button> */}
        <Button onClick={() => {updateFilter()}}>Update Filter</Button>
        <Button onClick={() => {setSelectedBreeds([])}}>Clear Search</Button>
        {/* <Button onClick={updateFilter}>Update Filter</Button> */}
  
      </Stack>
      <DogSearchResultsDataGrid 
        onPaginationModelChange={onPaginationModelChange} onSortModelChange={onSortModelChange} onFilterModelChange={onFilterModelChanged} rows={rows} rowCount={rowCount} filterModel={activeFilter}/>
      </div>
);

//function loadFromCursor(url:) {}

async function onSortModelChange(model: GridSortModel, _details: GridCallbackDetails<any>, paginationModel: GridPaginationModel): Promise<void> {
  
  await LoadDogs(model, paginationModel ,activeFilter);
}

async function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>, previousModel: GridPaginationModel, gridApiRef: MutableRefObject<GridApiCommunity>): Promise<GridPaginationModel> {
  var updatedModel: GridPaginationModel = model;
  var pageSizeChanged = false;

  if (!props.dogLookup)
  {
    return previousModel;
  }

  if (previousModel.pageSize !== model.pageSize) {
    let updatedPageNumber = Math.floor(previousModel.pageSize * previousModel.page / model.pageSize)
    updatedModel = {page: updatedPageNumber, pageSize : model.pageSize} as GridPaginationModel 
    pageSizeChanged = true;
  }

  var pageDifference = updatedModel.page - previousModel.pageSize; 

  if(!pageSizeChanged || pageDifference === 0)
  {
    return updatedModel;
  }

  var updatedData: Promise<void>

  if (!pageSizeChanged && pageDifference === 1 && pagingQueries.current.next)
  {
    console.info(pagingQueries.current.next)
    updatedData = LoadDogsFromQuery(pagingQueries.current.next);
  }
  else if (!pageSizeChanged && pageDifference === -1 && pagingQueries.current.prev)
  {
    console.info(pagingQueries.current.next)
    updatedData = LoadDogsFromQuery(pagingQueries.current.prev);

  }
  else
  {
    updatedData = LoadDogs(gridApiRef.current.getSortModel(), updatedModel, activeFilter)
  }
  
  await updatedData;

  return updatedModel;
}


  async function onFilterModelChanged(model: DogLookupFilter, pageModel: GridPaginationModel, gridApiRef: MutableRefObject<GridApiCommunity>): Promise<void> {
    LoadDogs(gridApiRef.current.getSortModel(), pageModel, model);
  }

}

interface dogSearchProps
{
    dogLookup: DogLookup | null;
}

interface PagingQueries
{
  next?: string;
  prev?: string;
}