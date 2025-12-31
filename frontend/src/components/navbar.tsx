import "../css/navbar.css"
import {Link, Outlet} from 'react-router-dom'
import logout from "../utils/logout";
import { useState, useEffect } from "react";

type NavbarProps = {
    loginStatus: boolean;
    setLoginStatus: Function;
    user: string;
    setUser: Function;
  };

export default function Navbar({loginStatus, setLoginStatus, user, setUser} : NavbarProps){

    function handleLogout(){
        logout();
        setLoginStatus(false);
        setUser("");
    }


    return(
        <>
            <div className="navbar-container">
                <Link to='/'><h1 id="title">AI KnowledgeBase Generator</h1></Link>
                {!loginStatus ? <ul id="user-links">
                    <Link to='/login' className='links'><li>Login</li></Link>
                    <Link to='/signup' className='links'><li>SignUp</li></Link>
                </ul> :
                <ul id="user-links">
                    <li id="user">Hello {user}</li>
                    <li id="logout" onClick={handleLogout}><a href="">Logout</a></li>
                </ul>
                }
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}