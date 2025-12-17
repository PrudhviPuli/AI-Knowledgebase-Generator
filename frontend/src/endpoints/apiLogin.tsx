import type { NavigateFunction } from "react-router";

//Api endpoint for logging in
//Post Request

export default async function ApiLogin(event: React.FormEvent<HTMLFormElement>, navigate: NavigateFunction){
    const formData: FormData = new FormData(event.currentTarget)
    const {email, password} = Object.fromEntries(formData.entries())

    try {
    const response = await fetch('whateverlinkhere', {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({email, password})
    })

    if (response.status == 401){
        //We can authenticate the password in the backend
        //response will return a 401 code if the password is not valid
        return {error: "INVALID PASSWORD OR EMAIL"}
    }

    if (!response.ok){
        return {error: "SERVER ERROR"}
    }

    const result = await response.json();
    //json that is returned should have a token and name
    //we can use this name and token for the frontend for authentication
    localStorage.setItem('user', result.name)
    localStorage.setItem('token', result.token)
    navigate('/')

    }
    catch(e){
    console.error(`Error:`, e);
    }
    
}