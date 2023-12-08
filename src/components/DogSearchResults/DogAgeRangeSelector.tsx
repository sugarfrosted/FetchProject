import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function DogAgeSlider(props: DogAgeRangeSelectorProps) {
    const marks = [
        { value: 0, label: '<1 year', },
        { value: 5, },
        { value: 10, label: '10 years', },
        { value: 15, },
        { value: 20, label: '20 years', },
        { value: 25, },
        { value: 32, label: 'No max'},
    ];
  
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={props.value}
        marks={marks}
        min={0}
        max={32}
        onChange={props.handleChange}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

interface DogAgeRangeSelectorProps
{
    handleChange: (event: Event, value: number[] | number, activeThumb: number) => void;
    value: number[];
}