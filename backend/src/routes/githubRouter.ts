import express from "express";
import type { Router } from "express";
import { downloadController } from "../controllers/githubController.js";
import authRepo from "../middleware/authRepo.js";

export const githubRouter:Router = express.Router();

githubRouter.get("/", authRepo, downloadController);
