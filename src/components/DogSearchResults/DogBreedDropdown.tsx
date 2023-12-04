import { Theme } from "@emotion/react";
import { Delete } from "@mui/icons-material";
import { FormControl, InputLabel, Select, MenuItem, MenuProps, Box, Chip, SelectChangeEvent, SxProps } from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { ReactNode, useMemo } from "react";

export default function DogBreedDropdown(props: DogBreedDropdownProps) {
  const dogBreeds = useMemo(() => props.dogBreeds, [props.dogBreeds]);


  function renderBreeds(): React.ReactNode {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {props.selectedBreeds.map((value) => (
            <Chip key={value} label={value}/>
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
            onChange={props.handleChange}
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
    selectedBreeds: string[];
    menuProps?: Partial<MenuProps> | undefined;
    sx?: SxProps<Theme> | undefined;
    handleChange?: ((event: SelectChangeEvent<string[]>, child: ReactNode) => void) | undefined
}