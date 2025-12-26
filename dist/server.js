import "dotenv/config";
import express from "express";
import { githubRouter } from "./routes/githubRouter.js";
const app = express();
const PORT = 8000;
app.use('/download-repo', githubRouter);
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
