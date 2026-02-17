import "../css/repos.css"
import parse from 'html-react-parser'

type ReposProps = {
    data: string[];
    viewRepo: (repoName: string) => void;
    repoData: string;
    image: string;
  };

export default function Repos({data, viewRepo, repoData, image} : ReposProps){

    const repo_names = data.map((names, index) => {
        return(
            <li key={index}>
                <div className="repo-content">{names}</div>
                <button className="repo-button" onClick={() => {viewRepo(names)}}>View</button>
            </li>
        )
    })
    return (
        <>
        <div className="names">
            <h2>Generated Repositories</h2>
            <ul className="repos">{repo_names}</ul>
        </div>
        {repoData !== "" &&
        <>
        <div className="seperator"><h2>View Repo</h2></div>
        <div className="data">{parse(repoData)}</div>
        </> 
        }
        { image && image !== "undefined" &&
            <div className="diagram-container">
                <h2 id="diagram-heading">Architechture Diagram</h2>
                <img src={`data:image/png;base64,${image}`} id="diagram" className="data"/>
            </div> 
        }
        </>
    )
}