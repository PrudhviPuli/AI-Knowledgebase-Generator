import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import type { Request, Response } from "express";

const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)

export const downloadController = (req:Request, res:Response) => {
  const repoUrl = req.query.repo;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({message : 'repo query param required'})
  }

  const repoName:string = path.basename(repoUrl, ".git")
  const destFolder:string = path.join(__dirname, "..", "downloaded_repos", repoName)

  fs.mkdirSync(destFolder, { recursive: true })

  exec(`git clone ${repoUrl} ${destFolder}`, (err) => {
    if (err){
        return res.status(500).json({ message: err.message })
    }
    return res.status(200).json({ message: `Downloaded ${repoName}` })
  })

}
