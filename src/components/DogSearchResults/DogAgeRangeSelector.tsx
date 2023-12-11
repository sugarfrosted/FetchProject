import {
    FormControl,
    FormLabel,
    Slider,
    SxProps,
} from '@mui/material';
import Settings from "../../Configuration.json";
import {
    Theme,
} from "@emotion/react";
import {
    useMemo,
} from 'react';

export default function DogAgeSlider(props: DogAgeRangeSelectorProps) {
    const max_age = useMemo(() => {
        var maxAge = ((Settings.DOG_SEARCH) && (Settings.DOG_SEARCH.MAX_AGE)) || 0;
        return maxAge < 10 ? 10 : maxAge;
    }, []);
    const marks = useMemo(() => {
        var result: {value: number, label?: string}[] = [];
        result.push({value: 0, label: '<1 year'});
        for (let count = 5; count < max_age; count += 5) {
            result.push({value: count});
        }
        result.push({value: max_age, label: `${max_age} years (no max)`});


        // find lowest middle 5 and label it
        const lowMidIdx = Math.floor((result.length - 1) / 2);
        result[lowMidIdx].label = `${result[lowMidIdx].value} years`;

        console.log(result);

        return result;
    }, [max_age]);

    return (
    /* eslint-disable indent */
      <FormControl sx={props.sx}>
        <FormLabel id="lblSelectAge">Age Selection</FormLabel>
        <Slider
          aria-labelledby="lblSelectAge"
          value={props.value}
          marks={marks}
          min={0}
          max={max_age}
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