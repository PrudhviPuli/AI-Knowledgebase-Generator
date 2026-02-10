import express from 'express'
import apiDocsController from '../controllers/apiDocsController.js';
import architectureSummaryController from '../controllers/architectureSummaryController.js';
import diagramController from '../controllers/diagramController.js';
import onboardingController from '../controllers/onboardingController.js';
import supabase from '../database/supabase-client.js';
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
            apiDocsController(),
            // diagramController() - disabled for now
        ])

        const repoId = res.locals.repoId as string;
        const userId = res.locals.userId as string | null;

        // Upsert generated docs to the generated_docs table
        const { error } = await supabase
            .from('generated_docs')
            .upsert({
                user_id: userId,
                repo_id: repoId,
                summary: summary.summary,
                onboarding: onboarding.onboarding,
                apidocs: apidocs.apidocs,
                // diagram: diagram.diagram, - disabled for now
            }, { onConflict: 'user_id,repo_id' });

        if (error) {
            console.error("Failed to save generated docs:", error.message);
        } else {
            console.log("Generated docs saved to database");
        }

        res.status(200).json({
            ...summary,
            ...onboarding,
            ...apidocs,
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }


})