import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { ChangeEvent, useState } from "react"
import * as EmailValidator from 'email-validator'

export default function LoginPane(params: loginPaneParams)
{
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [emailHasError, setEmailHasError] = useState();

    function handleLoginAttempt(event: any): void {
        throw new Error("Function not implemented.");
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
            value={Name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);}}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            value={Email}
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
        if (emailHasError && 
            EmailValidator.validate(event.target.value))
        {
            setEmailHasError(false);
        }
    }
}

export interface loginPaneParams {
    isVisible: true;
}

