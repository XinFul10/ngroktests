import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider";

export default function DefaultLayout() {
    const {user, token, setUser, setToken} = useStateContext()

    if (!token){
        return <Navigate to="/login"/>
    }

    const onLogout = (ev) => {
        ev.preventDefault();
        setUser(null);
        setToken(null);
    }
    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Books</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        <h1>Library Management System</h1>
                    </div>
                    <div>
                        {user.name}
                        <a href="#" className="btn-logout" onClick={onLogout}>Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}
