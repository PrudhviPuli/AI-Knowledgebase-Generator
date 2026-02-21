import express from "express";
import type {Express,Request,Response} from "express";
import { githubRouter } from "./routes/githubRouter.js";
import { authRouter } from "./routes/authRoutes.js";
import { llmRouter } from "./routes/llmRoutes.js";
import { userDataRouter } from "./routes/userDataRouter.js";
import cors from 'cors'

 
const app : Express = express();
const PORT : number = 8000;

app.use(cors({
  origin: 'https://ai-knowledgebase-generator-navy.vercel.app',
  credentials:true,
}))

app.options("*", cors());

app.use(express.json());
app.use('/download-repo', githubRouter, llmRouter);
app.use('/', authRouter)
app.use('/', userDataRouter)

app.use((req:Request, res:Response):void => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () : void => console.log(`Server running on http://localhost:${PORT}`));
