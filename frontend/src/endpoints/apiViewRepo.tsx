import getToken from "../utils/auth";

export default async function ApiViewRepo(name: string){

    const url = new URL("https://ai-pdf-knowledge-assistant.onrender.com/view-repo");
    url.searchParams.append("repo_name", name);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {'Authorization': `Bearer ${getToken()}` || ""}, //authentication
        credentials: 'include',
    })

    if (!response.ok){
        //any server error
        return {error: "SERVER_ERROR"}
    }
    
    const result = await response.json()
    // console.log(result)
    return result;
    
}