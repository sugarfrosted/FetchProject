import {
    atom,
} from "recoil";

export const userLoginState = atom<{userName: string | null, email: string | null, loginStatus: boolean}>({
    key: 'userLoggedIn', // unique ID (with respect to other atoms/selectors)
    default: {userName: null, email: null, loginStatus: false }, // default value (aka initial value)
});
