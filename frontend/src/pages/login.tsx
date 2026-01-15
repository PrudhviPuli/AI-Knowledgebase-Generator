import "../css/login.css"
import ApiLogin from "../endpoints/apiLogin";
import { useNavigate } from "react-router";


export default function Login(props: {
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<string>>;
  }){
    const navigate = useNavigate();

    return(
        <>
        <h1 id="login-title">Login</h1>
        <div className='login-container'>
            <form action="" className="login-form" onSubmit={(e) => {
                e.preventDefault();
                ApiLogin(e, navigate, props)
                }}>
                <div>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" id="email" name="email" required/>
                </div>
                <div>
                    <label htmlFor="password">Password</label><br />
                    <input type="password" id="password" name="password" required/>
                </div>
                <input type="submit" value='submit' id='submit-button'/>
            </form>
        </div>
        </>
    )
}