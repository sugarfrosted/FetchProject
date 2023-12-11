import {
    CaProvinces,
    UsStates,
} from "../../api/data/LocationData";
import {
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";
import {
    InputLabel,
    ListSubheader,
} from "@mui/material";

export default function StateAndCityCriteria() {
    return (
    /* eslint-disable indent */
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
          <Select defaultValue="" id="grouped-select" label="Grouping">
            <ListSubheader>{UsStates.name}</ListSubheader>
            {
              UsStates.divisions.map(state => <MenuItem key={state.abbr}>{state.name}</MenuItem>)
            }
            <ListSubheader>{CaProvinces.name}</ListSubheader>
            {
              CaProvinces.divisions.map(provinces => <MenuItem key={provinces.abbr}>{provinces.name}</MenuItem>)
            }
          </Select>
        </FormControl>
      </div>
    /* eslint-enable indent */
    );
}