import express from 'express'
import apiDocsController from '../controllers/apiDocsController.js';
import architectureSummaryController from '../controllers/architectureSummaryController.js';
import diagramController from '../controllers/diagramController.js';
import onboardingController from '../controllers/onboardingController.js';
import { Router, Request, Response } from 'express'

export const llmRouter: Router = express.Router();

llmRouter.get('/', async (req: Request, res: Response) => {
    
    try{
        const [summary, apidocs, onboarding] = await Promise.all([
            architectureSummaryController(),
            apiDocsController(),
            onboardingController(),
        ])

        //ONLY SENDING THESE FOR NOW AS THE DIAGRAM TAKES TOO LONG TO LOAD
        //WILL ADD DIAGRAM ON FINAL DRAFT
        res.status(200).json({
            ...summary,
            ...apidocs,
            ...onboarding
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }
    

})

llmRouter.get('/diagram', async (req: Request, res: Response) => {
    try{
        const diagram = await diagramController();
        res.status(200).json(diagram)
    }
    catch(err){
        res.status(500).json({error: err})
    }
}) 