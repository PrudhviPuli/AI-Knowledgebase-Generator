import getToken from "../utils/auth";

//the /me endpoint to check on if the user is logged in
export default async function isLoggedIn(){

    try{
        const response = await fetch('http://localhost:8000/me', {
            headers: {'Authorization': `Bearer ${getToken()}` || ""},
            credentials: 'include'
        })
        if (!response.ok){
            throw new Error('HTTP Error on IsLoggedIn')
        }

        const result = await response.json();
        // console.log(result)

        return true;
    }
    catch(e){
        console.log("Error caught at checking if user is logged in ", e)
    }
}