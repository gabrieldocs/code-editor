import { signOut } from "firebase/auth";
import { auth } from "./config";
import { useAuth } from ".";

export const useLogout = () => {
    const {dispatch} = useAuth();
    const logout = async () => {
        try {
            await signOut(auth);
            dispatch({type: "LOGOUT"})
            console.log("user logged out")
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return { logout };
};