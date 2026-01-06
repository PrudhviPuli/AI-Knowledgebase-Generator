import testController from "../controllers/llmController.js"
import { Router, Request, Response } from 'express'

export const llmRouter: Router = Router();

llmRouter.get('/', testController);