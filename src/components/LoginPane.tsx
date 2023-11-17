import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react"
import { validate as isValidEmail } from "email-validator";

export default function LoginPane(params: loginPaneParams)
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailHasError, setEmailHasError] = useState(false);
    const [nameHasError, setNameHasError] = useState(false);

    function handleLoginAttempt(event: any): void {
        setNameHasError(!name);
        setEmailHasError(!isValidEmail(email));

        if (nameHasError || emailHasError)
        {
            return;
        }

        console.log("you did it!");

    }

    return (
      <Dialog open={params.isVisible}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Login to use our dog matching and searching site.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="name"
            label="Name"
            value={name}
            onChange={(event) => onNameChanged(event)}
            onBlur={(event => {setNameHasError(!name)})}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            error={emailHasError}
            helperText={"Please enter a valid email."}
            value={email}
            onBlur={(event => {setEmailHasError(isValidEmail(email))})}
            onChange={event => onEmailChanged(event)}
            
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginAttempt}>Login</Button>
        </DialogActions>
      </Dialog>);

    function onEmailChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setEmail(event.target.value);
        if (emailHasError && isValidEmail(event.target.value))
        {
            setEmailHasError(false);
        }
    }

    function onNameChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setName(event.target.value);
        if (nameHasError && name)
        {
            setNameHasError(false);
        }
    }
}

export interface loginPaneParams {
    isVisible: true;
}

