import {
    FormControl,
    FormLabel,
    Slider,
    SxProps,
} from '@mui/material';
import {
    Mark,
} from '@mui/base/useSlider';
import Settings from "../../Configuration.json";
import {
    Theme,
} from "@emotion/react";
import {
    useMemo,
} from 'react';

/**
 * DogAgeSliderControl
 * @param props Props for the selector
 * @returns A slider for selecting ages for dogs in the search.
 */
export default function DogAgeSlider(props: DogAgeRangeSelectorProps) {
    const max_age = useMemo(() => {
        var maxAge = ((Settings.DOG_SEARCH) && (Settings.DOG_SEARCH.MAX_AGE)) || 0;
        return maxAge < 10 ? 10 : maxAge;
    }, []);
    const marks = useMemo(() => {
        var result: Mark[] = [];
        result.push({value: 0, label: <span style={{marginLeft: "49%"}}>&lt;1 year</span>});
        for (let count = 5; count < max_age; count += 5) {
            result.push({value: count});
        }
        result.push({value: max_age, label: <span style={{marginLeft: "-49%"}} >{`${max_age} years (no max)`}</span>});

        // find lowest middle 5 and label it
        const lowMidIdx = Math.floor((result.length - 1) / 2);
        result[lowMidIdx].label = <span>{`${result[lowMidIdx].value} years`}</span>;

        return result;
    }, [max_age]);

    return (
    /* eslint-disable indent */
      <FormControl fullWidth={props.fullWidth} sx={props.sx}>
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
    fullWidth?: boolean;
    sx?: SxProps<Theme> | undefined;
}