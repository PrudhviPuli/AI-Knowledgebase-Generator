import express from "express";
import { downloadController } from "../controllers/githubController.js";

export const githubRouter = express.Router();

githubRouter.get("/download-repo", downloadController);
