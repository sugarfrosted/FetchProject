import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Slide,
    Stack,
    SxProps,
} from "@mui/material";
import {
    CSSProperties,
    ReactNode,
    forwardRef,
    useMemo,
} from "react";
import {
    Dog,
} from "../../api/shared/DogLookupInterfaces";
import {
    PrettifyAge,
} from "../../utils/TextFormattingUtitilies";
import {
    Theme,
} from "@emotion/react";
import {
    TransitionProps,
} from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**Pop up to show dog match result or error. */
export default function DogMatchDisplay(props: DogMatchDisplayProps) {
    return (
    /* eslint-disable indent */
      <>
        {
          props.match ? (
            <DogMatchPopup {...props} />
          ) : (
            <NoMatchFound {...props} />
          )
        }
      </>
    /* eslint-enable indent */
    );
}

/**Control to show dog the match service matched someone with */
export function DogMatchPopup(props: DogMatchDisplayProps) {

    const displayAge = useMemo(() => PrettifyAge(props.match?.age), [props]);

    if(!props.match) {
        return <></>;
    }
    var sx = props.sx || {flexGrow: 1};

    return (
    /* eslint-disable indent */
      <Dialog open={!!props.match && props.open} TransitionComponent={Transition}>
        <Card title={props.match.name}>
          <CardHeader title={props.match.name} subheader="Your new best friend!" />
          <CardContent sx={sx}>
            <Paper
              sx={{margin: "10px", padding: "5px", width: "15em"}}
              component="img"
              alt={`Your new best friend: ${props.match.name}`}
              src={props.match.img} />
            <Stack direction="row" flexDirection="row" flexWrap="wrap" margin={"10px"}>
              <DogMatchDisplayLabelValueBox labelId={"matchBreed"} label="Breed" value={props.match.breed} />
              <DogMatchDisplayLabelValueBox labelId={"matchAge"} label="Age" value={displayAge} />
              <DogMatchDisplayLabelValueBox labelId={"matchZip"} label="Zip" value={props.match.zip_code} />
            </Stack>
          </CardContent>
          <CardActions>
            <Button id={'btnCloseSearchResult' as DogMatchButtonIds} onClick={props.onClose}>Search for another dog</Button>
          </CardActions>
        </Card>
      </Dialog>
    /* eslint-enable indent */
    );
}

/**Control to show when no matched dog was found. The API likely prevents this case from happening. */
export function NoMatchFound(props: PopupProps){
    return (
    /* eslint-disable indent */
      <Dialog sx={props.sx} open={props.open} onClose={props.onClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-no-match-dialogdescription" >
        <DialogTitle>No Match found.</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-no-match-dialogdescription">
            We were unable to find a match, please select more dogs.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id={'btnCloseNoMatchFound' as DogMatchButtonIds} onClick={props.onClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    /* eslint-enable indent */
    );
}

/**Label and value pairs for showing the details about the matched dog in the results page. */
export function DogMatchDisplayLabelValueBox(props: DogMatchDisplayLabelValueProps) {
    var label = typeof props.label === 'string' ? props.label + ":" : props.label;
    var labelReading = typeof props.label === 'string' ? props.label : undefined;
    var flex = typeof props.flex === 'undefined' ? 1 : props.flex ?? undefined;
    var labelStyle = props.labelStyle || {fontWeight: "bold"};

    return (
    /* eslint-disable indent */
      <Grid item xs="auto"
        margin={"10px"}
        alignContent="center"
        flex={flex}>
        <label
            style={labelStyle}
            id={props.labelId}
            aria-label={labelReading}
        >
          {label}
        </label>
        <span
          style={props.valueStyle}
          aria-labelledby={props.labelId}
        >
          {props.value}
        </span>
      </Grid>
    /* eslint-disable indent */
    );
}


export type DogMatchButtonIds = 'btnCloseNoMatchFound' | 'btnCloseSearchResult';


interface DogMatchDisplayLabelValueProps {
    labelId: string;
    label: string | ReactNode;
    value: string | ReactNode;
    labelStyle?: CSSProperties;
    valueStyle?: CSSProperties;
    flex?: number | null;
};

interface DogMatchDisplayProps extends PopupProps {
    match: Dog | undefined;
}

interface PopupProps {
    sx?: SxProps<Theme> | undefined;
    open: boolean;
    onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}