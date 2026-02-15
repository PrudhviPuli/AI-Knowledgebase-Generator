import {Request, Response} from 'express'
import supabase from '../database/supabase-client.js'

export default async function repoData(req: Request, res: Response){

    const user_id = req.user?.user_id;

    const {data, error} = await supabase
        .from("generated_docs")
        .select("repo_name")
        .eq("user_id", user_id)

    if (error){
        console.error("Error fetching repos data", error);
        return res.status(500).json({error: "Failed to fetch repos"})
    }

    // try{
    //     console.log(data)
    //     res.status(200).json({names: data})
    // }
    // catch(e){
    //     console.error("Error in controller", e);
    //     res.status(500).json({error: "Internal server error"})
    // }
    const repo_names = data.map( (object) => object.repo_name)

    return res.status(200).json({names: repo_names})
    
}