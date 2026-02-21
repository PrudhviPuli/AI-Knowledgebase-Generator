import getToken from "../utils/auth";

//the /me endpoint to check on if the user is logged in
export default async function isLoggedIn(){

    try{
        const token = getToken();

        // No token → definitely not logged in (skip request)
        if (!token) return false;

        const response = await fetch('https://ai-pdf-knowledge-assistant.onrender.com/me', {
            headers: {'Authorization': `Bearer ${token}` || ""},
            credentials: 'include'
        })
        

        if (response.status === 401 || response.status === 403) {
            return false; // not logged in is NOT an error
        }
        
        if (!response.ok){
            throw new Error('HTTP Error on IsLoggedIn')
        }

        return true;
    }
    catch(e){
        console.log("Error caught at checking if user is logged in ", e);
        return false
    }
}