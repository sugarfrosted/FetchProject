import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Stack } from "@mui/material";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import DogLookup from "../api/data/DogLookup";
import DogSearchResultTable from "./DogSearchResults/DogSearchResultTable";
import DogSearchResultsDataGrid, { DogSearchResultsDataGridRef } from "./DogSearchResults/DogSearchResultsDataGrid";
import { GridPaginationModel, GridCallbackDetails, GridSortModel } from "@mui/x-data-grid";
import React from "react";

export default function DogSearch(props: dogSearchProps) {
    const [selectedBreed, setSelectedBreed] = useState<string>("");
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);
    const resultGridStyle = useMemo(() => ({ height: '100%', width: '100%' } as React.CSSProperties), []);
    const resultContainerStyle = useMemo(() => ({ height: '25em', width: '100%' } as React.CSSProperties), []);
    const ref = useRef<DogSearchResultsDataGridRef>();


    useEffect(() => {
        if(props.dogLookup) {
          props.dogLookup.LoadDogBreeds().then(() => {
            var breeds = props.dogLookup?.DogBreeds || [];
            setDogBreeds(breeds);
          })}
    }, [props.dogLookup, props.dogLookup?.IsLoggedin])

    
    return (<div>
        <FormControl >
<Stack direction="row" spacing={2}>
  <InputLabel id="lblSelectBreeds">Breed</InputLabel>
  <Select
    labelId="lblSelectBreeds"
    sx={{minWidth: "20em"}}
    id="selSelectBreeds"
    value={selectedBreed}
    onChange={(event: SelectChangeEvent) => setSelectedBreed(event.target.value)}
    label="Breed" 
    >
        {dogBreeds.map((x) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
  </Select>
  <Button>Filter to Selected Breed</Button>
  <Button>View All Breeds</Button>
  

</Stack>
</FormControl>
<DogSearchResultsDataGrid rows={[]} rowCount={0} onPaginationModelChange={function (model: GridPaginationModel, details: GridCallbackDetails<any>): void {
        throw new Error("Function not implemented.");
      } } onSortModelChange={function (model: GridSortModel, details: GridCallbackDetails<any>): void {
        throw new Error("Function not implemented.");
      } } ref={ref} />
</div>
);
}

interface dogSearchProps
{
    dogLookup: DogLookup | null;
}