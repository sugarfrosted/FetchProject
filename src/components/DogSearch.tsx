import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Stack, SortDirection, Box, Chip } from "@mui/material";
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
const MenuProps = {
  PaperProps: {
    style: {
      // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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


    return (
      <div>
  <FormControl sx={{ m: 1, width: "100%", mt: 3 }}>
    <InputLabel id="lblSelectBreeds" >Breed</InputLabel>
    <Select
      labelId="lblSelectBreeds"
      multiple
      id="selSelectBreeds"
      value={selectedBreeds}
      onChange={handleChange}
      label="Breed" 
      renderValue={renderBreeds}
      MenuProps={MenuProps}
      >
          {dogBreeds.map((x) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
    </Select>
</FormControl>
  <Stack direction={"column"}>
  <Button onClick={childRef.current?.loadSelection}>View Selected</Button>
  <Button onClick={() => setSelectedBreeds([])}>Clear Search</Button>
  

</Stack>
<DogSearchResultsDataGridWrapper 
      onPaginationModelChange={function (model: GridPaginationModel, details: GridCallbackDetails<any>): void {
        throw new Error("Function not implemented.");
      } } onSortModelChange={function (model: GridSortModel, details: GridCallbackDetails<any>): void {
        throw new Error("Function not implemented.");
      } } dataLoadingHandler={GetResultsHandler}
      />
      </div>
);

  function renderBreeds(): React.ReactNode {
    // if (selectedBreeds.length === 0) {
    //   return <Box><em>Placeholder</em></Box>
    // }
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedBreeds.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      );
    };
}

interface dogSearchProps
{
    dogLookup: DogLookup | null;
}