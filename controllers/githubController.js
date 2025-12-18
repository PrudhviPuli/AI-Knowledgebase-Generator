import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const downloadController = (req, res) => {
  const repoUrl = decodeURIComponent(String(req.query.repo || "")).trim();

  if (!repoUrl) {
    return res.status(400).json({message : 'repo query param required'})
  }

  const repoName = path.basename(repoUrl, ".git")
  const destFolder = path.join(__dirname, "..", "downloaded_repos", repoName)

  fs.mkdirSync(destFolder, { recursive: true })

  exec(`git clone ${repoUrl} ${destFolder}`, (err) => {
    if (err){
        return res.status(500).json({ message: err.message })
    }
    return res.status(200).json({ message: `Downloaded ${repoName}` })
  })

}
