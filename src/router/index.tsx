import { useAuth } from "../context/auth";
import { PrivateRouter, PublicRouter } from "./routes";

export default function Routes () {
    const { state } = useAuth();

    if(state.authIsReady && state.user) {
        return PrivateRouter
    } else {
        return PublicRouter
    }
}