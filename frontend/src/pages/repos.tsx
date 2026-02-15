import "../css/repos.css"

type ReposProps = {
    data: string[];
  };

export default function Repos({data} : ReposProps){
    const repo_names = data.map((names, index) => {
        return(
            <li key={index}>
                <div className="repo-content">{names}</div>
                <button className="repo-button">View</button>
            </li>
        )
    })
    return (
    <div>
        <h2>Generated Repositories</h2>
        <ul className="repos">{repo_names}</ul>
    </div>
    )
}