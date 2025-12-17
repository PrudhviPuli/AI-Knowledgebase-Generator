import "../css/signup.css"
import ApiSignup from "../endpoints/apiSignup"
import { useNavigate } from "react-router";

export default function Signup(){
    const navigate = useNavigate();

    return(
        <>
        <h1 id="signup-title">SignUp</h1>
        <div className='signup-container'>
            <form action="" className="signup-form" onSubmit={(e) => ApiSignup(e, navigate)}>
                <div>
                    <label htmlFor="name">Name</label><br />
                    <input type="text" id="name" name="name" required/>
                </div>
                <div>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" id="email" name="email" required/>
                </div>
                <div>
                    <label htmlFor="password">Password</label><br />
                    <input type="password" id="password" name="password" required/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label><br />
                    <input type="password" id="confirmPassword" name="confirmPassword" required/>
                </div>
                <input type="submit" value='submit' id='submit-button'/>
            </form>
        </div>
        </>
    )
}