import {Request, Response} from 'express'

export default function loginStatusController(req: Request, res: Response){
    res.status(200).json({message: "successfully authenticated"})
}