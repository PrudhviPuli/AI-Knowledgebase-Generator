import {Request, Response} from 'express'
import supabase from '../database/supabase-client.js'

export default async function repoData(req: Request, res: Response){

    // const {data, error} = await supabase
    //     .from("repos")
    //     .select("*")
    //     .eq("user_id", somethinghere)

    // if (error){
    //     console.log("Error fetching repos data", error)
    // }

    // try{
    //     // console.log(req.body)
    //     res.status(200).json({message: "Successfully got the request"})
    // }
    // catch(e){
    //     console.error("Error in controller", e);
    //     res.status(500).json({error: "Internal server error"})
    // }

    res.status(200).json({message: "Successfully reached RepoData"})
    
}