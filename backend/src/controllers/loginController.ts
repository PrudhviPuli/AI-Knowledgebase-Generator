import {Request, Response} from 'express'
import supabase from '../database/supabase-client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'
import { Secret } from 'jsonwebtoken'
import { fileURLToPath } from "url";

const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../../.env')});

export default async function loginController(req: Request, res: Response) {

    const {data, error} = await supabase
        .from("users")
        .select("*")
        .eq("email", req.body.email.toLowerCase())

    if (error){
        console.log("Error logging in", error)
    }

    //HANDLE ERROR FOR WHEN EMAIL IS INVALID

    if (data){
        if (data.length > 0) {
            const userIsValid = await bcrypt.compare(req.body.password, data[0].password)
            try{
                if (userIsValid){
                    const token = jwt.sign({id: data[0].id, name: data[0].name}, process.env.SECRET as Secret, {expiresIn: '1h'})
                    res.status(200).json({name: data[0].name, token: token})
                }
                else{
                    res.status(401).json({message: "Authentication Failed Please Try Again"})
                }
            }
            catch(e){
                console.log("CAUGHT THE ERROR HERE FOR 500")
                console.error("Error in login controller", e);
                res.status(500).json({error: "Internal server error"})
            }
            return;
        }
        res.status(401).json({message: "No User Found Please Try Again"})
        return;
    }
    else{
        res.status(401).json({message: "No User Found Please Try Again"})
        return;
    }
    
}