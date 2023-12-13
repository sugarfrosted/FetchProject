import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    MenuItem,
    MenuProps,
    Select,
    SelectChangeEvent,
    Stack,
    SxProps,
    TextField,
    Theme,
} from "@mui/material";
import {
    CaProvinces,
    UsStates,
} from "../../api/data/LocationData";
import {
    DogLookupContext,
    ErrorContext,
} from "../../state/DogContext";
import {
    InputLabel,
    ListSubheader,
} from "@mui/material";
import {
    ReactNode,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import {
    useSetRecoilState,
} from "recoil";
import {
    userLoginState,
} from "../../state/atoms";

const DogLocationSearch = forwardRef(function DogLocationSearch(props: {zipCodes: string[], onZipChange: (zipCodes: string[]) => void},
    ref: React.ForwardedRef<{clear: () => void}>) {
    const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
    const [cityText, setCityText] = useState<string>();
    const [totalZipCodes, setTotalZipCodes] = useState<number>(0);
    const [activeCriteria, setActiveCriteria] = useState<{states?: string[], cityText?: string, from: number} | undefined>();
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    const getPrevDisabled = useMemo(() => !activeCriteria || totalZipCodes === 0 || activeCriteria.from === 0, [activeCriteria, totalZipCodes]);
    const getNextDisabled = useMemo(() => !activeCriteria || totalZipCodes === 0 || activeCriteria.from + 25 > totalZipCodes, [activeCriteria, totalZipCodes]);
    const dogLookupContext = useContext(DogLookupContext);
    const errorHandlerContext = useContext(ErrorContext);
    const setLoginState = useSetRecoilState(userLoginState);

    const updateActiveCriteria = useCallback(function updateActiveCriteria(cityText: string | undefined, selectedDivisions: string[], from: number) {
        var updatedCriteria: {states?: string[], cityText?: string, from: number} = {from: from};
        if (cityText) {
            updatedCriteria.cityText = cityText;
        }
        if (selectedDivisions && selectedDivisions.length !== 0) {
            updatedCriteria.states = selectedDivisions;
        }
        setActiveCriteria(updatedCriteria);
    }, []);

    useImperativeHandle(ref, () => {
        return {
            clear() {
                console.log("more butts");
                clear();
            },
        };

    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => props.onZipChange(zipCodes), [zipCodes]);

    useEffect(() => {
        if (!activeCriteria) {
            setTotalZipCodes(0);
            setZipCodes([]);
            return;
        } else {
            dogLookupContext.GetZipCodesFromLocation(activeCriteria).then(
                result => {
                    let zipCodes = result.results.map(x => x.zip_code);
                    setZipCodes(zipCodes);
                    setTotalZipCodes(result.total);
                },
                error => {
                    errorHandlerContext.HandleError(error, () => setLoginState({userName: null, email: null, loginStatus: false}));
                });
        }
    }, [dogLookupContext, activeCriteria, errorHandlerContext, setLoginState]);

    function clear(_event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        setZipCodes([]);
        setCityText(undefined);
        setSelectedDivisions([]);
        setActiveCriteria(undefined);
    }

    function handleDivisionChange(event: SelectChangeEvent<string[]>, _child: ReactNode): void {
        const { target: { value } } = event;
        setSelectedDivisions(typeof value === 'string' ? value.split(',') : value);
    }


    return (
    /* eslint-disable indent */
      <Card>
        <CardHeader sx={{color: "#1976D2"}} title="Location Criteria" />
        <CardContent>
          <Grid container spacing={2} paddingX={2}>
            <Grid item xs={6}>
              <DogStateSelect fullWidth handleChange={handleDivisionChange} selectedStates={selectedDivisions}/>
            </Grid>
            <Grid item xs={6} >
              <FormControl fullWidth>
                <TextField label="City" id="tfCity" content={cityText} onChange={event => setCityText(event.target.value)}/>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField label="ZIP Codes for search" id="tfZipCodes" disabled multiline value={(zipCodes || []).join(", ")} />
              </FormControl></Grid>
          </Grid>
          <CardActionArea>
            <Stack direction="row" sx={{marginX: 2, marginTop: 2}}>
              <Button disabled={getPrevDisabled}
                onClick={_event => {
                  if (!activeCriteria) {return;}
                  let currentActiveCriteria = {
                    states: activeCriteria.states,
                    from: activeCriteria.from - 25,
                    cityText: activeCriteria.cityText,
                  };
                  setActiveCriteria(currentActiveCriteria);
                }}>
                Get previous 25
              </Button>
              <Button onClick={() => updateActiveCriteria(cityText, selectedDivisions, 0)}>Update</Button>
              <Button disabled={getNextDisabled}
                onClick={_event => {
                  if (!activeCriteria) {return;}
                  let currentActiveCriteria = {
                    states: activeCriteria.states,
                    from: activeCriteria.from + 25,
                    cityText: activeCriteria.cityText,
                  };
                  setActiveCriteria(currentActiveCriteria);
                }}>
                Get next 25
              </Button>
              <Button onClick={clear}>Clear Query</Button>
            </Stack>
          </CardActionArea>
        </CardContent>
      </Card>
    /* eslint-enable indent */
    );
});

export default DogLocationSearch;

export function DogStateSelect(props: SubdivisionDropdownProps) {

    return (
    /* eslint-disable indent */
      <div>
        <FormControl fullWidth={props.fullWidth} sx={props.sx}>
          <InputLabel htmlFor="selSelectStates">States and Provinces</InputLabel>
          <Select
            multiple
            id="selSelectStates"
            value={props.selectedStates}
            onChange={props.handleChange}
            label="States and Provinces"
            MenuProps={props.menuProps}
          >
            <ListSubheader>{UsStates.name}</ListSubheader>
            {
              UsStates.divisions.map(state => <MenuItem value={state.abbr} key={state.abbr}>{state.name}</MenuItem>)
            }
            <ListSubheader>{CaProvinces.name}</ListSubheader>
            {
              CaProvinces.divisions.map(province => <MenuItem value={province.abbr} key={province.abbr}>{province.name}</MenuItem>)
            }
          </Select>
        </FormControl>
      </div>
    /* eslint-enable indent */
    );
}

interface SubdivisionDropdownProps {
    fullWidth?: boolean;
    selectedStates: string[];
    menuProps?: Partial<MenuProps> | undefined;
    sx?: SxProps<Theme> | undefined;
    handleChange?: ((event: SelectChangeEvent<string[]>, child: ReactNode) => void) | undefined
}