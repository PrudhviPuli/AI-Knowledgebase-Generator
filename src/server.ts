import "dotenv/config";
import express from "express";
import type {Express,Request,Response} from "express";
import { githubRouter } from "./routes/githubRouter.js";

const app : Express = express();
const PORT : number = 8000;

app.use('/download-repo',githubRouter);

app.use((req:Request, res:Response):void => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () : void => console.log(`Server running on http://localhost:${PORT}`));
