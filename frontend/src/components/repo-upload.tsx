import "../css/repo-upload.css"
import ApiRepo from "../endpoints/apiRepo"
import ApiDiagram from "../endpoints/apiDiagram"
import { useState } from 'react'
import parse from 'html-react-parser'

export default function RepoUpload(){

    //grabbing the knowledgebase data, setting it to state
    const [data, setData] = useState<string>("")
    const [imageData, setImageData] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        setLoading(true);

        const response = await ApiRepo(event);
        if (response.error) {
            setData(`<p>Something went wrong. Please try again.</p>`)
            setLoading(false)
            return;
        }
        setData(`<div class="data">` + (response.summary ?? "") + (response.onboarding ?? "") + (response.apidocs ?? "") + "</div>")
        setLoading(false)

        setImageLoading(true);
        const diagram_response = await ApiDiagram();        
        setImageData(diagram_response.diagram)
        setImageLoading(false)
    }

    //<img src={`data:image/png;base64,${data}`} THIS IS HOW WE SHOWCASE IMAGE

    return(
        <>
            <form action="" className="repo-upload" onSubmit={handleSubmit}>
                <label htmlFor="">GitHub Clone Link</label>
                <input type="text" id="input-field" placeholder="https://github.com/repository" name="repolink"/>
                <button id="generate-button" disabled={loading}>{loading ? "Generating data..." : "Generate!"}</button>
            </form>
            {<div>
                {parse(data)}
                {imageLoading && (
                    <div className="diagram-container">
                        <h2 id="diagram-heading">Architechture Diagram</h2>
                        <p>Generating Diagram...</p>
                    </div> 
                )}
                { imageData && imageData !== "undefined" &&
                <div className="diagram-container">
                    <h2 id="diagram-heading">Architechture Diagram</h2>
                    <img src={`data:image/png;base64,${imageData}`} id="diagram" className="data"/>
                </div> 
                }
            </div>}
        </>
    )
}