import "../css/navbar.css"
import {Link, Outlet} from 'react-router-dom'

export default function Navbar(){
    return(
        <>
            <div className="navbar-container">
                <Link to='/'><h1 id="title">AI KnowledgeBase Generator</h1></Link>
                <ul id="user-links">
                    <Link to='/login' className='links'><li>Login</li></Link>
                    <Link to='/signup' className='links'><li>SignUp</li></Link>
                </ul>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}