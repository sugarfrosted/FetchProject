import {
    atom,
} from "recoil";

export const userNameState = atom<string | null>({
    key: 'userName', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});

export const userEmailState = atom<string | null>({
    key: 'userEmail', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});

export const userLoginState = atom<{userName: string | null, email: string | null, loginStatus: boolean}>({
    key: 'userLoggedIn', // unique ID (with respect to other atoms/selectors)
    default: {userName: null, email: null, loginStatus: false }, // default value (aka initial value)
});
