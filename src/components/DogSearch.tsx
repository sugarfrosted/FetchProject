import { SelectChangeEvent, Button, Stack } from "@mui/material";
import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import DogLookup, { DogLookupFilter, DogLookupParams } from "../api/data/DogLookup";
import DogSearchResultsDataGrid from "./DogSearchResults/DogSearchResultsDataGrid";
import { GridPaginationModel, GridCallbackDetails, GridSortModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { Dog } from "../api/shared/interfaces";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import DogBreedDropdown from "./DogSearchResults/DogBreedDropdown";
import { DogLookupContext } from "../state/DogContext";

export default function DogSearch(props: dogSearchProps) {
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<DogLookupFilter>({})
    const [rows, setRows] = useState<Dog[]>([])
    const [rowCount, setRowCount] = useState<number>(0)
    const [nextPagingQuery, setNextPagingQuery] = useState<string | undefined>();
    const [prevPagingQuery, setPrevPagingQuery] = useState<string | undefined>();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();
    const dogLookup = useContext(DogLookupContext);


    const MenuProps = {
      PaperProps: {
        style: {
          // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    useEffect(() => {
        if(dogLookup) {
          dogLookup.LoadDogBreeds().then(() => {
            var breeds = dogLookup?.DogBreeds || [];
            setDogBreeds(breeds);
          })}
    }, [dogLookup, dogLookup?.IsLoggedin])

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

    if(!dogLookup) {
      return;
    }

    await dogLookup.LoadDogs(queryParams).then(result =>
      {
        setRows(result.dogs);
        setRowCount(result.total);
        setNextPagingQuery(result.next);
        setPrevPagingQuery(result.prev);
      });
  }

  async function LoadDogsFromQuery(query: string)
  {
    if (!dogLookup) {
      return;
    }

    await dogLookup.LoadDogsFromQuery(query).then(queryResult =>
      {
          setRowCount(queryResult.total);
          setRows(queryResult.dogs);
          setNextPagingQuery(queryResult.next);
          setPrevPagingQuery(queryResult.prev);
      });
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
        <Button onClick={() => {updateFilter()}}>Update Filter</Button>
        <Button onClick={() => {setSelectedBreeds([])}}>Clear Search</Button>
  
      </Stack>
      <DogSearchResultsDataGrid 
        onPaginationModelChange={onPaginationModelChange}
        onSortModelChange={onSortModelChange}
        onFilterModelChange={onFilterModelChanged}
        onRowSelectionModelChange={onRowSelectionModelChange}
        rows={rows}
        rowCount={rowCount}
        filterModel={activeFilter}
        selection={rowSelectionModel} />
      </div>
);

async function onSortModelChange(model: GridSortModel, _details: GridCallbackDetails<any>, paginationModel: GridPaginationModel): Promise<void> {

  await LoadDogs(model, paginationModel ,activeFilter);
}

async function onPaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>, previousModel: GridPaginationModel, sortModel: GridSortModel): Promise<GridPaginationModel> {
  console.log("external handler")
  var updatedModel: GridPaginationModel = model;
  var pageSizeChanged = false;

  if (!dogLookup)
  {
    return previousModel;
  }

  if (previousModel.pageSize !== model.pageSize) {
    let updatedPageNumber = Math.floor(previousModel.pageSize * previousModel.page / model.pageSize)
    updatedModel = {page: updatedPageNumber, pageSize : model.pageSize} as GridPaginationModel 
    pageSizeChanged = true;
  }

  var pageDifference = updatedModel.page - previousModel.pageSize; 

  if(!pageSizeChanged && pageDifference === 0)
  {
    return updatedModel;
  }

  var updatedData: Promise<void>

  if (!pageSizeChanged && pageDifference === 1 && nextPagingQuery)
  {
    updatedData = LoadDogsFromQuery(nextPagingQuery);
  }
  else if (!pageSizeChanged && pageDifference === -1 && prevPagingQuery)
  {
    updatedData = LoadDogsFromQuery(prevPagingQuery);
  }
  else
  {
    updatedData = LoadDogs(sortModel, updatedModel, activeFilter)
  }
  
  await updatedData;

  return updatedModel;
}


  async function onFilterModelChanged(model: DogLookupFilter, pageModel: GridPaginationModel, gridApiRef: MutableRefObject<GridApiCommunity>): Promise<void> {
    LoadDogs(gridApiRef.current.getSortModel(), pageModel, model);
  }

  function onRowSelectionModelChange(rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails<any>): void
  {
    console.log("cat");
    console.log(details);
    setRowSelectionModel(rowSelectionModel);
  }

}

interface dogSearchProps
{
}