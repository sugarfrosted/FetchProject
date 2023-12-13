import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    MenuProps,
    Select,
    SelectChangeEvent,
    SxProps,
} from "@mui/material";
import {
    ReactNode,
    useMemo,
} from "react";
import {
    Theme,
} from "@emotion/react";

/**
 * Dropdown list of dog breeds
 * @param props control props, including the list of dog breeds.
 * @returns A control for selecting dog breeds, using the chip control for display.
 */
export default function DogBreedDropdown(props: DogBreedDropdownProps) {
    const dogBreeds = useMemo(() => props.dogBreeds, [props.dogBreeds]);


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
      <FormControl sx={props.sx} fullWidth={props.fullWidth}>
        <InputLabel htmlFor="selSelectBreeds" >Breed</InputLabel>
        <Select
          multiple
          id="selSelectBreeds"
          value={props.selectedBreeds}
          onChange={props.handleChange}
          label="Breed"
          renderValue={renderBreeds}
          MenuProps={props.menuProps}
        >
          {dogBreeds.map(breedName => <MenuItem value={breedName} key={breedName}>{breedName}</MenuItem>)}
        </Select>
      </FormControl>
    /* eslint-enable indent */
    );
}

interface DogBreedDropdownProps {
    dogBreeds: string[]
    selectedBreeds: string[];
    menuProps?: Partial<MenuProps> | undefined;
    sx?: SxProps<Theme> | undefined;
    fullWidth?: boolean;
    handleChange?: ((event: SelectChangeEvent<string[]>, child: ReactNode) => void) | undefined
}