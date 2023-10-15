import { createBrowserRouter } from "react-router-dom"
import Home from "../modules/Home"
import Intro from "../modules/Intro"

export const router = createBrowserRouter([
    {
        path: '/teste',
        element: <Intro />
    },
    {
        path: '/',
        element: <Home /> 
    }
])
