import testController from "../controllers/onboardingController.js"
import { Router, Request, Response } from 'express'

export const llmRouter: Router = Router();

llmRouter.get('/', testController);