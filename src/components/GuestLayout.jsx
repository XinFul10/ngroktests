import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function GuestLayout() {
    const {token} = useStateContext()
    if (token) {
        return <Navigate to="/" />
    }
    return (
        <div>
            BSIT 2-5 Group 2
            <Outlet/>           
        </div>
    )
}
