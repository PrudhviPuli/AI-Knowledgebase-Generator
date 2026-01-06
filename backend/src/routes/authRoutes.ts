import authenticateToken from "../middleware/authenticatetoken.js";
import loginController from "../controllers/loginController.js"
import signupController from "../controllers/signupController.js";
import loginStatusController from "../controllers/loginstatusController.js";
import { Router, Request, Response } from 'express'

export const authRouter: Router = Router();

authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.get('/me', authenticateToken, loginStatusController)
