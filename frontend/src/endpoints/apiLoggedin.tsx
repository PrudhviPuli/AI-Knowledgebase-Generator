import getToken from "../utils/auth";

//the /me endpoint to check on if the user is logged in
export default async function isLoggedIn(){

    try{
        const response = await fetch('/me-endpoint-link', {
            headers: {'Authorization': `Bearer ${getToken()}` || ""},
            credentials: 'include'
        })
        if (!response.ok){
            throw new Error('HTTP Error on IsLoggedIn')
        }

        // const result = await response.json();

        return true;
    }
    catch(e){
        console.log("Error caught at checking if user is logged in ", e)
    }
}