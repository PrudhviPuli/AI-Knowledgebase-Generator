import "../css/repo-upload.css"
import ApiRepo from "../endpoints/apiRepo"
import { useState, useEffect } from 'react'

export default function RepoUpload(){

    //grabbing the knowledgebase data, setting it to state
    const [data, setData] = useState<any>(null)
    function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        setData(ApiRepo(event))
    }

    return(
        <>
            <form action="" className="repo-upload" onSubmit={handleSubmit}>
                <label htmlFor="">GitHub Clone Link</label>
                <input type="text" id="input-field" placeholder="https://github.com/repository" name="repolink"/>
                <button id="generate-button">Generate!</button>
            </form>
            {/* {generate the data here } */}
        </>
    )
}