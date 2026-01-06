import testController from "../controllers/llmController.js";
import { Router } from 'express';
export const llmRouter = Router();
llmRouter.get('/', testController);
