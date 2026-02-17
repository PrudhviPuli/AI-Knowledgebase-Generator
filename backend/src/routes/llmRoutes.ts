import express from 'express'
import apiDocsController from '../controllers/apiDocsController.js';
import architectureSummaryController from '../controllers/architectureSummaryController.js';
import diagramController from '../controllers/diagramController.js';
import onboardingController from '../controllers/onboardingController.js';
import supabase from '../database/supabase-client.js';
import {vectorStore} from '../database/retriever.js'
import { Router, Request, Response } from 'express'

export const llmRouter: Router = express.Router();

llmRouter.get('/', async (req: Request, res: Response) => {
    const repoID = res.locals.repoID;

    const retriever = vectorStore.asRetriever({
        filter: {
            repo_id: repoID
        }
    })

    try{
        const [summary, apidocs, onboarding, diagram] = await Promise.all([
            architectureSummaryController(retriever),
            apiDocsController(retriever),
            onboardingController(retriever),
            diagramController(retriever)
        ])

        const repoId = res.locals.repoId as string;
        const userId = res.locals.userId as string | null;
        const repoName = res.locals.repoName as string | null;

        // Upsert generated docs to the generated_docs table
        const { error } = await supabase
            .from('generated_docs')
            .upsert({
                user_id: userId,
                repo_id: repoId,
                repo_name: repoName,
                summary: summary.summary,
                onboarding: onboarding.onboarding,
                apidocs: apidocs.apidocs,
                diagram: diagram?.diagram
            }, { onConflict: 'user_id,repo_id' });

        if (error) {
            console.error("Failed to save generated docs:", error.message);
        }
        res.status(200).json({
            ...summary,
            ...onboarding,
            ...apidocs,
            ...diagram
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }


})

llmRouter.get('/diagram', async (req: Request, res: Response) => {
    const repoID = res.locals.repoID;

    const retriever = vectorStore.asRetriever({
        filter: {
            repo_id: repoID
        }
    })

    try{
        const diagram = await diagramController(retriever);
        res.status(200).json(diagram)
    }
    catch(err){
        res.status(500).json({error: err})
    }
}) 