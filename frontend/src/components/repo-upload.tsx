import "../css/repo-upload.css"
import ApiRepo from "../endpoints/apiRepo"
import ApiDiagram from "../endpoints/apiDiagram"
import { useState } from 'react'
import parse from 'html-react-parser'

export default function RepoUpload(){

    //grabbing the knowledgebase data, setting it to state
    const [data, setData] = useState<string>("")
    const [imageData, setImageData] = useState<string>("")

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        const response = await ApiRepo(event);
        setData(`<div className="data">` + response.summary + response.onboarding + response.apidocs + "</div>")
        const diagram_response = await ApiDiagram();
        // setImageData(diagram_response.diagram)
    }

    //<img src={`data:image/png;base64,${data}`} THIS IS HOW WE SHOWCASE IMAGE

    return(
        <>
            <form action="" className="repo-upload" onSubmit={handleSubmit}>
                <label htmlFor="">GitHub Clone Link</label>
                <input type="text" id="input-field" placeholder="https://github.com/repository" name="repolink"/>
                <button id="generate-button">Generate!</button>
            </form>
            {<div>
                {parse(data)}
                { imageData && imageData !== "undefined" && <img src={`data:image/png;base64,${imageData}`} id="diagram" className="data"/>}
            </div>}
        </>
    )
}