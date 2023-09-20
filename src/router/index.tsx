import { createBrowserRouter } from "react-router-dom"
import Home from "../modules/Home"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home /> 
    }
])
