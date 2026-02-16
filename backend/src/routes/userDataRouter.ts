import express from 'express'
import { Router, Request, Response } from 'express'
import repoData from '../controllers/repoDataController.js';
import authRepo from '../middleware/authRepo.js';
import viewRepo from '../controllers/viewRepoController.js';

export const userDataRouter: Router = express.Router();

userDataRouter.get('/get-repos', authRepo, repoData)
userDataRouter.get('/view-repo', authRepo, viewRepo)