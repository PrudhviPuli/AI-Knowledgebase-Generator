import "../css/repo-upload.css"
import ApiRepo from "../endpoints/apiRepo"
import { useState, useEffect } from 'react'

export default function RepoUpload(){

    //grabbing the knowledgebase data, setting it to state
    const [data, setData] = useState<String>("")

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        const response = await ApiRepo(event);
        // setData(response.diagram)
    }

    return(
        <>
            <form action="" className="repo-upload" onSubmit={handleSubmit}>
                <label htmlFor="">GitHub Clone Link</label>
                <input type="text" id="input-field" placeholder="https://github.com/repository" name="repolink"/>
                <button id="generate-button">Generate!</button>
            </form>
            {data && <img src={`data:image/png;base64,${data}`} />}
        </>
    )
}