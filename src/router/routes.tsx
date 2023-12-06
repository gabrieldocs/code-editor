import { createBrowserRouter } from "react-router-dom"
import Home from "../modules/Home"
import Intro from "../modules/Intro"
import Login from "../modules/Login"
import FileUploadComponent from "../modules/Project/FileUploadComponent"

export const PublicRouter = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
])

export const PrivateRouter = createBrowserRouter([
    {
        path: '/editor',
        element: <Home /> 
    },
    {
        path: '/',
        element: <FileUploadComponent />
    }
])
