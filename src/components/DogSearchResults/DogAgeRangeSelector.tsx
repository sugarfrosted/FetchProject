import {
    FormControl,
    FormLabel,
    Slider,
    SxProps,
} from '@mui/material';
import {
    Theme,
} from "@emotion/react";

export default function DogAgeSlider(props: DogAgeRangeSelectorProps) {
    const marks = [
        { value: 0, label: '<1 year' },
        { value: 5 },
        { value: 10, label: '10 years' },
        { value: 15 },
        { value: 20, label: '20 years' },
        { value: 25 },
        { value: 32, label: 'No max'},
    ];

    return (
    /* eslint-disable indent */
      <FormControl sx={props.sx}>
        <FormLabel id="lblSelectAge">Age Selection</FormLabel>
        <Slider
          aria-labelledby="lblSelectAge"
          value={props.value}
          marks={marks}
          min={0}
          max={32}
          onChange={props.handleChange}
          valueLabelDisplay="auto"
        />
      </FormControl>
    /* eslint-enable indent */
    );
}

interface DogAgeRangeSelectorProps {
    handleChange: (event: Event, value: number[] | number, activeThumb: number) => void;
    value: number[];
    sx?: SxProps<Theme> | undefined;
}