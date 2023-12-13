import {
    CSSProperties,
    ReactNode,
} from "react";
import {
    Grid,
} from "@mui/material";


/**Label and value pairs for showing the details about the matched dog in the results page. */
export function LabelValueBox(props: LabelValueProps) {
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

interface LabelValueProps {
    labelId: string;
    label: string | ReactNode;
    value: string | ReactNode;
    labelStyle?: CSSProperties;
    valueStyle?: CSSProperties;
    flex?: number | null;
};