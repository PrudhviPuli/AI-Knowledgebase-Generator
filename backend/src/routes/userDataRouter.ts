import express from 'express'
import { Router, Request, Response } from 'express'
import repoData from '../controllers/repoDataController.js';
import authRepo from '../middleware/authRepo.js';

export const userDataRouter: Router = express.Router();

userDataRouter.get('/get-repos', authRepo, repoData)