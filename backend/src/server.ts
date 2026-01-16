import express from "express";
import type {Express,Request,Response} from "express";
import { githubRouter } from "./routes/githubRouter.js";
import { authRouter } from "./routes/authRoutes.js";
import { llmRouter } from "./routes/llmRoutes.js";
import test from "./controllers/test.js";
import cors from 'cors'
import diagramController from "./controllers/diagramController.js";
import onboardingController from "./controllers/onboardingController.js";
import architectureSummaryController from "./controllers/architectureSummaryController.js";
import apiDocsController from "./controllers/apiDocsController.js";
 
const app : Express = express();
const PORT : number = 8000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true,
}))

app.use(express.json());
app.use('/download-repo',githubRouter);
app.use('/', authRouter)
// testController();
// test();
// diagramController();
// onboardingController();
// architectureSummaryController();
apiDocsController();
app.use('/', llmRouter)

app.use((req:Request, res:Response):void => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () : void => console.log(`Server running on http://localhost:${PORT}`));
