import express from 'express'
import apiDocsController from '../controllers/apiDocsController.js';
import architectureSummaryController from '../controllers/architectureSummaryController.js';
import diagramController from '../controllers/diagramController.js';
import onboardingController from '../controllers/onboardingController.js';
import { Router } from 'express'

export const llmRouter: Router = express.Router();

// llmRouter.get('/', apiDocsController);
// llmRouter.get('/', architectureSummaryController);
// llmRouter.get('/', onboardingController);
llmRouter.get('/', diagramController);