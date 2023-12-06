import { createBrowserRouter } from "react-router-dom"
import Home from "../modules/Home"
import Intro from "../modules/Intro"
import Login from "../modules/Login"

export const PublicRouter = createBrowserRouter([
    {
        path: '/teste',
        element: <Intro />
    },
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/editor',
        element: <Home /> 
    }
])

export const PrivateRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home /> 
    }
])
