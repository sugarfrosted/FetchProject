import { Theme } from "@emotion/react";
import { Delete } from "@mui/icons-material";
import { FormControl, InputLabel, Select, MenuItem, MenuProps, Box, Chip, SelectChangeEvent, SxProps } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { useMemo } from "react";

export default function DogBreedDropdown(props: DogBreedDropdownProps) {
  const dogBreeds = useMemo(() => props.dogBreeds, [props.dogBreeds]);

    const handleChange = (event: SelectChangeEvent<typeof props.selectedBreeds>) => {
    const { target: { value }, } = event;
    props.selectedBreeds = typeof value === 'string' ? value.split(',') : value;
  };

  function renderBreeds(): React.ReactNode {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {props.selectedBreeds.map((value) => (
            <Chip key={value} label={value} onDelete={(event) => {console.log(event)}}/>
          ))}
        </Box>
      );
    };

    return (
    <FormControl sx={props.sx}>
        <InputLabel id="lblSelectBreeds" >Breed</InputLabel>
        <Select
            labelId="lblSelectBreeds"
            multiple
            id="selSelectBreeds"
            value={props.selectedBreeds}
            onChange={handleChange}
            label="Breed" 
            renderValue={renderBreeds}
            MenuProps={props.menuProps}
        >
            {dogBreeds.map((x) => <MenuItem value={x} key={x}>{x}</MenuItem>)}
        </Select>
    </FormControl>);
}

interface DogBreedDropdownProps {
    dogBreeds: string[]
    menuProps?: Partial<MenuProps> | undefined;
    selectedBreeds: string[];
    sx?: SxProps<Theme> | undefined
}