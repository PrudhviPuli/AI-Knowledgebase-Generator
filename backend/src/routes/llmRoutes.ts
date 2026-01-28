import express from 'express'
import apiDocsController from '../controllers/apiDocsController.js';
import architectureSummaryController from '../controllers/architectureSummaryController.js';
import diagramController from '../controllers/diagramController.js';
import onboardingController from '../controllers/onboardingController.js';
import { Router, Request, Response } from 'express'

export const llmRouter: Router = express.Router();

// llmRouter.get('/', apiDocsController);
// llmRouter.get('/', architectureSummaryController);
// llmRouter.get('/', onboardingController);
// llmRouter.get('/', diagramController);
llmRouter.get('/', async (req: Request, res: Response) => {
    
    try{
        const [summary, onboarding, apidocs] = await Promise.all([
            architectureSummaryController(),
            onboardingController(),
            apiDocsController()
        ])

        //ONLY SENDING THESE FOR NOW AS THE DIAGRAM TAKES TOO LONG TO LOAD
        //WILL ADD DIAGRAM ON FINAL DRAFT
        res.status(200).json({
            ...summary,
            ...onboarding,
            ...apidocs
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }
    

})