import { useState } from "react";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./config";
import { useAuth } from ".";

export const useLogin = () => {
    const [error, setError] = useState<any>(false);
    const [isPending, setIsPending] = useState<any>(false);
    const provider = new GithubAuthProvider();
    const {dispatch} = useAuth();

    const login = async () => {
        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            if(!res) {
                throw new Error("Não foi possível completar o login")
            }
            const user = res.user;
            dispatch({type: "LOGIN", payload: user})
            
            console.log(user)
            setIsPending(false)
        } catch (error: any) {
            console.log(error)
            setError(error.message)
            setIsPending(false)
        }
    }

    return {login, error, isPending}
}