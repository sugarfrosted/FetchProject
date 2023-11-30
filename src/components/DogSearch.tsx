import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Stack, SortDirection, Box, Chip } from "@mui/material";
import { MutableRefObject, createRef, useEffect, useMemo, useRef, useState } from "react";
import DogLookup, { DogLookupFilter, DogLookupParams } from "../api/data/DogLookup";
import DogSearchResultTable from "./DogSearchResults/DogSearchResultTable";
import DogSearchResultsDataGrid, { DogSearchResultsDataGridProps } from "./DogSearchResults/DogSearchResultsDataGrid";
import { GridPaginationModel, GridCallbackDetails, GridSortModel } from "@mui/x-data-grid";
import React from "react";
import { Dog } from "../api/shared/interfaces";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import DogBreedDropdown from "./DogSearchResults/DogBreedDropdown";

export default function DogSearch(props: dogSearchProps) {
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const resultGridStyle = useMemo(() => ({ height: '100%', width: '100%' } as React.CSSProperties), []);
    const resultContainerStyle = useMemo(() => ({ height: '25em', width: '100%' } as React.CSSProperties), []);
    const [activeFilter, setActiveFilter] = useState<DogLookupFilter>({})
    const [rows, setRows] = useState<Dog[]>([])
    const [rowCount, setRowCount] = useState<number>(0)
    const MenuProps = {
      PaperProps: {
        style: {
          // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    async function GetResultsHandler(params: DogLookupParams): Promise<{ dogs: Dog[]; total: number; } | undefined>
    {
      console.log("help")
      if (!props.dogLookup) {
        return;
      }
      return await props.dogLookup.LoadDogs(params);
    }

    useEffect(() => {
        if(props.dogLookup) {
          props.dogLookup.LoadDogBreeds().then(() => {
            var breeds = props.dogLookup?.DogBreeds || [];
            setDogBreeds(breeds);
          })}
    }, [props.dogLookup, props.dogLookup?.IsLoggedin])

    useEffect(() => {}, [activeFilter])

  function LoadDogs(apiRef: React.MutableRefObject<GridApiCommunity>, pageModel: any, filter?: DogLookupFilter | undefined | null) {
    var queryParams: DogLookupParams = {};
    if (filter) {
      queryParams.filter = filter;
    }
    var sortModel = apiRef.current.getSortModel()
    if (sortModel && sortModel.length > 0) {
      queryParams.sort = sortModel;
    }

    queryParams.size = pageModel.size;
    queryParams.page = pageModel.page;

    if(props.dogLookup) {
      props.dogLookup.LoadDogs(queryParams).then(result => {
        setRows(result.dogs);
        setRowCount(result.total);
      });
    }
  }

  function updateFilter() {
    var filter: DogLookupFilter = {}
    if (selectedBreeds && selectedBreeds.length > 0)
    {
      filter.breeds = selectedBreeds;
    }

    setActiveFilter(filter);
  }



  return (
    <div>
      <DogBreedDropdown sx={{ m: 1, width: "100%", mt: 3 }} dogBreeds={dogBreeds} selectedBreeds={selectedBreeds} menuProps={MenuProps}/>
      <Stack direction={"column"}>
        {/* <Button onClick={LoadDogs} >Load Search</Button> */}
        <Button onClick={() => {updateFilter()}}>Update Filter</Button>
        <Button onClick={() => {setSelectedBreeds([])}}>Clear Search</Button>
        {/* <Button onClick={updateFilter}>Update Filter</Button> */}
  
      </Stack>
      <DogSearchResultsDataGrid 
        onPaginationModelChange={function (model: GridPaginationModel, details: GridCallbackDetails<any>): void {
          throw new Error("Function not implemented.");
          } } onSortModelChange={onSortModelChange} onFilterModelChange={onFilterModelChanged} rows={rows} rowCount={rowCount} filterModel={activeFilter}/>
      </div>
);

//function loadFromCursor(url:) {}

function onSortModelChange(model: GridSortModel, details: GridCallbackDetails<any>): void {
  // Reflect outside or use API
  console.log(model);
  console.log(details);
}
  function onFilterModelChanged(model: DogLookupFilter, pageModel: any, gridApiRef: any): void {
    console.log("filtermodel changed")
    console.log(model);
    LoadDogs(gridApiRef, pageModel, model);
  }

}

interface dogSearchProps
{
    dogLookup: DogLookup | null;
}