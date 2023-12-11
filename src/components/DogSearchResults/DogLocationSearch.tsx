import {
    CaProvinces,
    UsStates,
} from "../../api/data/LocationData";
import {
  Box,
  Chip,
    FormControl,
    MenuItem,
    MenuProps,
    Select,
    SelectChangeEvent,
    SxProps,
    Theme,
} from "@mui/material";
import {
    InputLabel,
    ListSubheader,
} from "@mui/material";
import { ReactNode } from "react";

export default function StateAndCityCriteria(props: DogBreedDropdownProps) {
    function renderBreeds(): React.ReactNode {
        return (
        /* eslint-disable indent */
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {props.selectedBreeds.map(value => (
              <Chip key={value} label={value}/>
            ))}
          </Box>
        /* eslint-enable indent */
        );
    };

    return (
    /* eslint-disable indent */
      <div>
        <FormControl sx={props.sx}>
          <InputLabel htmlFor="selSelectStates">States and Provinces</InputLabel>
          <Select
            multiple
            id="selSelectStates"
            value={props.selectedBreeds}
            onChange={props.handleChange}
            label="States and Provinces"
            renderValue={renderBreeds}
            MenuProps={props.menuProps}
          >
            <ListSubheader>{UsStates.name}</ListSubheader>
            {
              UsStates.divisions.map(state => <MenuItem value={[state.abbr, state.name]} key={state.abbr}>{state.name}</MenuItem>)
            }
            <ListSubheader>{CaProvinces.name}</ListSubheader>
            {
              CaProvinces.divisions.map(province => <MenuItem value={[province.abbr, province.name]} key={province.abbr}>{province.name}</MenuItem>)
            }
          </Select>
        </FormControl>
      </div>
    /* eslint-enable indent */
    );
}

interface DogBreedDropdownProps {
    dogBreeds: string[]
    selectedBreeds: string[];
    menuProps?: Partial<MenuProps> | undefined;
    sx?: SxProps<Theme> | undefined;
    handleChange?: ((event: SelectChangeEvent<string[]>, child: ReactNode) => void) | undefined
}