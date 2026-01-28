import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import path from 'path'
import {Response, Request, NextFunction} from 'express' 
import { Secret } from 'jsonwebtoken';
import { AuthTokenPayload } from '../types/auth.js';
import { fileURLToPath } from "url";

const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)

dotenv.config({path: path.resolve(__dirname, '../../.env')});

//THIS IS AUTH SPECIFICIALLY FOR GITHUB CONTROLLER, CAN WORK WHEN OR NOT LOGGED IN

export default function authRepo(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return next();
    }

    let token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.SECRET as Secret);
        req.user = decoded as AuthTokenPayload;
    }
    catch{
    }

    next();
}