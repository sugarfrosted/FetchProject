import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    validate as isValidEmail,
} from "email-validator";
import {
    AuthContext,
} from "../state/DogContext";


export default function LoginPane(params: loginPaneParams) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailHasError, setEmailHasError] = useState(false);
    const [nameHasError, setNameHasError] = useState(false);
    const tfNameRef = useRef<HTMLDivElement>(null);
    const loginLookup = useContext(AuthContext);

    useEffect(() => {
        setName("");
        setEmail("");
        setNameHasError(false);
        setEmailHasError(false);
        if (tfNameRef?.current) {tfNameRef.current.focus();}
    }, [tfNameRef, params.open]);

    async function handleLoginAttempt() {
        setNameHasError(!name);
        setEmailHasError(!isValidEmail(email));

        if (!name || !isValidEmail(email) || !loginLookup) {
            return;
        }

        await loginLookup.Login(name, email).then(result => {
            if (params.onSuccess) {
                params.onSuccess(result.name, result.email);
            }
        },
        error => {if (params.onFailure) { params.onFailure(error); }}
        ).finally(() => params.onClose());
    }

    function onEmailChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setEmail(event.target.value);
        if (emailHasError && isValidEmail(event.target.value)) {
            setEmailHasError(false);
        }
    }

    function onNameChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setName(event.target.value);
        if (nameHasError && name) {
            setNameHasError(false);
        }
    }

    return (
    /* eslint-disable indent */
      <Dialog open={params.open}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Login to use our dog matching and searching site.
          </DialogContentText>
          <TextField
            required
            error={nameHasError}
            helperText={nameHasError ? "Please enter your name" : ""}
            margin="dense"
            id="name"
            label="Name"
            value={name}
            onChange={event => onNameChanged(event)}
            onBlur={_event => {setNameHasError(!name);}}
            fullWidth
            variant="standard"
            inputRef={tfNameRef}
          />
          <TextField
            required
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            error={emailHasError}
            helperText={emailHasError ? "Please enter a valid email" : ""}
            value={email}
            onBlur={_event => {setEmailHasError(!isValidEmail(email));}}
            onChange={event => onEmailChanged(event)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginAttempt}>Login</Button>
          <Button onClick={params.onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    /* eslint-enable indent */
    );
}

export interface loginPaneParams {
    onSuccess?: ((name: string, email: string) => void) | undefined;
    onFailure?: ((error: any) => void) | undefined;
    onClose: () => void;
    open: boolean;
}

