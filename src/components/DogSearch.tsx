import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Stack, SortDirection } from "@mui/material";
import { MutableRefObject, createRef, useEffect, useMemo, useRef, useState } from "react";
import DogLookup, { DogLookupParams } from "../api/data/DogLookup";
import DogSearchResultTable from "./DogSearchResults/DogSearchResultTable";
import DogSearchResultsDataGrid, { DogSearchResultsDataGridProps, DogSearchResultsDataGridRef } from "./DogSearchResults/DogSearchResultsDataGrid";
import { GridPaginationModel, GridCallbackDetails, GridSortModel } from "@mui/x-data-grid";
import React from "react";
import { Dog } from "../api/shared/interfaces";

export default function DogSearch(props: dogSearchProps) {
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const resultGridStyle = useMemo(() => ({ height: '100%', width: '100%' } as React.CSSProperties), []);
    const resultContainerStyle = useMemo(() => ({ height: '25em', width: '100%' } as React.CSSProperties), []);
    const childRef = createRef<DogSearchResultsDataGridRef>();

    /**
     * Wrapper to get around the type issues surrounding passing references
     * @param props 
     * @returns 
     */
    function DogSearchResultsDataGridWrapper(props: DogSearchResultsDataGridProps) {
      return DogSearchResultsDataGrid(props, childRef);
    }

    async function GetResultsHandler(params: DogLookupParams): Promise<{ dogs: Dog[]; total: number; } | undefined>
    {
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

    useEffect(() => {})

  const handleChange = (event: SelectChangeEvent<typeof selectedBreeds>) => {
    const {
      target: { value },
    } = event;
    setSelectedBreeds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


    return (<div>
        <FormControl >
<Stack direction="row" spacing={2}>
  {/* <InputLabel id="lblSelectBreeds">Breed</InputLabel> */}
  <Select
    labelId="lblSelectBreeds"
    multiple
    autoWidth
    id="selSelectBreeds"
    value={selectedBreeds}
    onChange={handleChange}
    label="Breed" 
    >
        {dogBreeds.map((x) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
  </Select>
  <Button>Filter to Selected Breed</Button>
  <Button>View All Breeds</Button>
  

</Stack>
</FormControl>
<DogSearchResultsDataGridWrapper 
      onPaginationModelChange={function (model: GridPaginationModel, details: GridCallbackDetails<any>): void {
        throw new Error("Function not implemented.");
      } } onSortModelChange={function (model: GridSortModel, details: GridCallbackDetails<any>): void {
        throw new Error("Function not implemented.");
      } } dataLoadingHandler={GetResultsHandler}
      />
</div>
);
}

interface dogSearchProps
{
    dogLookup: DogLookup | null;
}