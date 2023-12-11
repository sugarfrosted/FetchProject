import {
    Box,
    Paper,
    Popover,
    Typography,
} from '@mui/material';
import {
    Dog,
} from '../../api/shared/DogLookupInterfaces';

export default function DogImagePopover(props: { dog: Dog | null; anchorEl: Element | null; open: boolean; onClose: () => void; }) {

    return (
    /* eslint-disable indent */
      <Popover
        id="dogImagePopover"
        sx={{
          pointerEvents: 'none',
        }}
        open={props.open}
        anchorEl={props.anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={props.onClose}
        disableRestoreFocus
        >
        { props.dog &&
          <Paper
              aria-labelledby='popupDogName'
              sx={{ padding: "5px", alignContent: "right", border: 'thin', borderColor: 'black' }}
              elevation={4}
            >
            <Typography variant='h4' id='popupDogName'>{props.dog.name}</Typography>
            <Box
              component="img"
              sx={{
                width: "17em",
                maxheight: "20em",
              }}
              alt={`Depicted: ${props.dog.name}$`}
              src={props.dog?.img} />
          </Paper>
        }
      </Popover>
    /* eslint-enable indent */
    );
}
