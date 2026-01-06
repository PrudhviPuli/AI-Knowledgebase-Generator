import {Request, Response} from 'express'
import supabase from '../database/supabase-client.js'
import bcrypt from 'bcrypt'

export default async function signupController(req: Request, res: Response){

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const {data, error} = await supabase
        .from("users")
        .insert([{name: req.body.name.toLowerCase(), email: req.body.email.toLowerCase(), password: hashedPass}])
        .select()

    if (error){
        console.log("Error signing up", error)
    }

    try{
        // console.log(req.body)
        res.status(200).json({message: "Successfully got the request"})
    }
    catch(e){
        console.error("Error in controller", e);
        res.status(500).json({error: "Internal server error"})
    }
    
}