import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Stack,
    SxProps,
} from "@mui/material";
import {
    Dog,
} from "../../api/shared/DogLookupInterfaces";
import {
    useMemo,
    forwardRef,
} from "react";
import {
    Theme,
} from "@emotion/react";
import {
    PrettifyAge,
} from "../../utils/TextFormattingUtitilies";
import {
    TransitionProps,
} from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DogMatchDisplay(props: DogMatchDisplayProps) {

    const displayAge = useMemo(() => PrettifyAge(props.match?.age), [props]);

    return (
    /* eslint-disable indent */
      <Dialog sx={props.sx} open={!!props.match && props.open} TransitionComponent={Transition}>
        {props.match ? (
          <Card title={props.match.name}>
            <CardHeader title={props.match.name} subheader="Your new best friend!" />
            <CardMedia
              component="img"
              alt="The house from the offer."
              src={props.match.img} />
            <CardContent>
              <Stack direction="row" flexDirection="row">
                <Box flex={1}><label id="matchBreed" >Breed:</label><span aria-labelledby="matchBreed">{props.match.breed}</span></Box>
                <Box flex={1}><label id="matchAge">Age:</label><span aria-labelledby="matchAge">{displayAge}</span></Box>
                <Box flex={1}><label id="matchZip" >Location:</label><span aria-labelledby="matchZip">{props.match.zip_code}</span></Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button onClick={props.onClose}>Search for another dog</Button>
            </CardActions>
          </Card>) :
          null
        }
      </Dialog>
    /* eslint-enable indent */
    );
}

export function NoMatchFound(props: {open: boolean, handleClose: () => void}){
    return (
    /* eslint-disable indent */
      <Dialog open={props.open} onClose={props.handleClose}
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
          <Button onClick={props.handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    /* eslint-enable indent */
    );
}

interface DogMatchDisplayProps {
    match: Dog | undefined;
    open: boolean;
    sx?: SxProps<Theme> | undefined;
    onClose?: () => void;
}