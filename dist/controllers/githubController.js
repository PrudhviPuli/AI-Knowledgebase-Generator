import fs from "fs";
import path from "path";
import crypto from "crypto";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IGNORE_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".turbo"]);
const ALLOW_EXT = new Set([
    ".ts", ".tsx", ".js", ".jsx",
    ".py", ".java", ".go", ".rs",
    ".md", ".txt", ".json", ".yml", ".yaml", ".sql"
]);
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
function getFilePath(root) {
    const result = [];
    const foldersToVisit = [root];
    while (foldersToVisit.length > 0) {
        const currentFolder = foldersToVisit.pop();
        if (!currentFolder)
            continue;
        const entries = fs.readdirSync(currentFolder, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentFolder, entry.name);
            if (entry.isDirectory()) {
                if (!IGNORE_DIRS.has(entry.name)) {
                    foldersToVisit.push(fullPath);
                }
            }
            else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (ALLOW_EXT.has(ext) || entry.name === "LICENSE") {
                    result.push(fullPath);
                }
            }
        }
    }
    return result;
}
function languageFromExt(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".py")
        return "python";
    if (ext === ".js" || ext === ".jsx")
        return "js";
    if (ext === ".ts" || ext === ".tsx")
        return "js";
    if (ext === ".java")
        return "java";
    if (ext === ".go")
        return "go";
    if (ext === ".rs")
        return "rust";
    if (ext === ".cpp" || ext === ".cxx")
        return "cpp";
    if (ext === ".md")
        return "markdown";
    return null;
}
function getSplitterForFile(filePath) {
    const lang = languageFromExt(filePath);
    if (lang) {
        return RecursiveCharacterTextSplitter.fromLanguage(lang, {
            chunkSize: 1200,
            chunkOverlap: 150,
        });
    }
    return new RecursiveCharacterTextSplitter({
        chunkSize: 1200,
        chunkOverlap: 150,
        separators: ["\n\n", "\n", " ", ""],
    });
}
export async function splitRepoToDocuments(repoRoot, repoId) {
    const files = getFilePath(repoRoot);
    const allChunks = [];
    for (const file of files) {
        const relPath = path.relative(repoRoot, file).replaceAll("\\", "/");
        const text = fs.readFileSync(file, "utf8").trim();
        if (!text)
            continue;
        const splitter = getSplitterForFile(file);
        const chunks = await splitter.createDocuments([text], [{ repo_id: repoId, file_path: relPath }]);
        chunks.forEach((d, i) => {
            d.metadata.chunk_index = i;
            d.metadata.chunk_id = sha256(`${repoId}|${relPath}|${i}`);
        });
        allChunks.push(...chunks);
    }
    return allChunks;
}
async function upsertToSupabase(params) {
    const { docs, supabaseUrl, supabaseKey, openAIApiKey, tableName } = params;
    const client = createClient(supabaseUrl, supabaseKey);
    const embeddings = new OpenAIEmbeddings({ openAIApiKey });
    const BATCH_SIZE = 64;
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);
        const texts = batch.map(d => d.pageContent);
        const vectors = await embeddings.embedDocuments(texts);
        // 2) Map into your DB schema rows
        const rows = batch.map((d, idx) => {
            const repo_id = d.metadata.repo_id;
            const file_path = d.metadata.file_path;
            const chunk_index = d.metadata.chunk_index;
            const chunk_id = d.metadata.chunk_id;
            return {
                repo_id,
                file_path,
                chunk_index,
                chunk_id,
                content: d.pageContent,
                metadata: d.metadata,
                embedding: vectors[idx],
            };
        });
        const { error } = await client
            .from(tableName)
            .upsert(rows, { onConflict: "chunk_id" });
        if (error)
            throw new Error(`Supabase upsert failed: ${error.message}`);
    }
}
export const downloadController = (req, res) => {
    const repoUrl = req.query.repo;
    if (!repoUrl || typeof repoUrl !== "string") {
        return res.status(400).json({ message: "repo query param required" });
    }
    const repoName = path.basename(repoUrl, ".git");
    const destFolder = path.join(__dirname, "..", "downloaded_repos", repoName);
    if (fs.existsSync(destFolder))
        fs.rmSync(destFolder, { recursive: true, force: true });
    fs.mkdirSync(destFolder, { recursive: true });
    exec(`git clone ${repoUrl} ${destFolder}`, async (err) => {
        if (err)
            return res.status(500).json({ message: err.message });
        try {
            const sbApiKey = process.env.SUPABASE_API_KEY;
            const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
            const openAIApiKey = process.env.OPENAI_API_KEY;
            if (!sbApiKey || !sbUrl || !openAIApiKey) {
                return res.status(500).json({ message: "Missing env vars (SUPABASE_API_KEY, SUPABASE_URL_LC_CHATBOT, OPENAI_API_KEY)" });
            }
            const repoId = sha256(repoUrl);
            const docs = await splitRepoToDocuments(destFolder, repoId);
            await upsertToSupabase({
                docs,
                supabaseUrl: sbUrl,
                supabaseKey: sbApiKey,
                openAIApiKey,
                tableName: "documents",
            });
            return res.status(200).json({
                message: `Downloaded + indexed ${repoName}`,
                repo_id: repoId,
                chunks: docs.length,
            });
        }
        catch (e) {
            return res.status(500).json({ message: e?.message ?? "Indexing failed" });
        }
    });
};
