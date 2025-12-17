import "../css/repo-upload.css"

export default function RepoUpload(){
    return(
        <>
            <form action="" className="repo-upload">
                <label htmlFor="">GitHub Clone Link</label>
                <input type="text" id="input-field" placeholder="https://github.com/repository"/>
                <button id="generate-button">Generate!</button>
            </form>
        </>
    )
}