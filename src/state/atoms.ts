import {
    atom,
} from "recoil";

/**
 * State of if the user is logged in or not and their email/name.
 */
export const userLoginState = atom<{userName: string | null, email: string | null, loginStatus: boolean}>({
    key: 'userLoggedIn', // unique ID (with respect to other atoms/selectors)
    default: {userName: null, email: null, loginStatus: false }, // default value (aka initial value)
});
