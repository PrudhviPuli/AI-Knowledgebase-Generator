import getToken from "../utils/auth";

export default async function ApiDiagram(){


    const response = await fetch("https://ai-pdf-knowledge-assistant.onrender.com/diagram", {
        method: "GET",
        headers: {'Authorization': `Bearer ${getToken()}` || ""}, //authentication
        credentials: 'include',
    })

    if (!response.ok){
        //any server error
        return {error: "SERVER_ERROR"}
    }
    
    //awaiting the AI Knowledgebase here
    const result = await response.json()

    return result;
    
}