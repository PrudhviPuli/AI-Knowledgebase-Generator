import getToken from "../utils/auth"

export default async function ApiRepo(event: React.FormEvent<HTMLFormElement>){
    
    event.preventDefault();
    const formData: FormData = new FormData(event.currentTarget)
    const {repolink} = Object.fromEntries(formData.entries()) as {repolink: string}

    // console.log(repolink)

    const url = new URL("http://localhost:8000/download-repo");
    url.searchParams.append("repolink", repolink);

    //sending over the repo link
    const response = await fetch(url.toString(), {
        headers: {'Authorization': `Bearer ${getToken()}` || ""}, //authentication
        credentials: 'include',
        body: JSON.stringify({repolink}) //sent it here
    })

    if (response.status == 401){
        //token does not match in the backend, sends 401 
        return {error: "UNAUTHORIZED"}
    }

    if (response.status == 403) {
        //if the token is expired the backend will send a 403
        return {error: "TOKEN_EXPIRED"}
    }

    if (!response.ok){
        //any server error
        return {error: "SERVER_ERROR"}
    }
    
    //awaiting the AI Knowledgebase here
    const result = await response.json()
    return result;
    
}