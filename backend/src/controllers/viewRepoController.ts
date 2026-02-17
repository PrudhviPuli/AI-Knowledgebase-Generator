import {Request, Response} from 'express'
import supabase from '../database/supabase-client.js'

export default async function viewRepo(req: Request, res: Response){

    const user_id = req.user?.user_id;
    const repo_name = req.query.repo_name

    const {data, error} = await supabase
        .from("generated_docs")
        .select("summary, onboarding, apidocs, diagram")
        .eq("user_id", user_id)
        .eq("repo_name", repo_name)

    if (error){
        console.error("Error fetching repos data", error);
        return res.status(500).json({error: "Failed to fetch repos"})
    }

    // console.log(data[0].diagram);
    const {summary, onboarding, apidocs, diagram} = data[0];
    const repo_data = data.map( (object) => Object.values(object))

    return res.status(200).json({data: summary + onboarding + apidocs, image: diagram})
    
}