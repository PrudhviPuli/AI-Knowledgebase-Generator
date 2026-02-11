import fs from "fs";
import path from "path";
import crypto from "crypto";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import type { Request, Response, NextFunction } from "express";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import type { Document } from "@langchain/core/documents";
import dotenv from 'dotenv'

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, '../../.env')});

const IGNORE_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".turbo"]);
const ALLOW_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx",
  ".py", ".java", ".go", ".rs",
  ".md", ".txt", ".json", ".yml", ".yaml", ".sql"
]);


const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

function getFilePath(root: string): string[] {
    const result: string[] = [];
    const foldersToVisit: string[] = [root];
  
    while (foldersToVisit.length > 0) {
      const currentFolder = foldersToVisit.pop();
      if(!currentFolder) continue;
  
      const entries = fs.readdirSync(currentFolder, { withFileTypes: true });
  
      for (const entry of entries) {
        const fullPath = path.join(currentFolder, entry.name);
  
        if (entry.isDirectory()) {
          if(!IGNORE_DIRS.has(entry.name)) {
            foldersToVisit.push(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();

            // Skip package-lock.json files
            if (entry.name === "package-lock.json") {
              continue;
            }

            if(ALLOW_EXT.has(ext) || entry.name === "LICENSE")
            {
                result.push(fullPath);
            }
        }
      }
    }
    return result;
}

type SplitLang =
  | "cpp" | "go" | "java" | "js" | "php" | "proto" | "python"
  | "rst" | "ruby" | "rust" | "scala" | "swift"
  | "markdown" | "latex" | "html" | "sol";
  
function languageFromExt(filePath: string): SplitLang | null {
    const ext = path.extname(filePath).toLowerCase();
  
    if (ext === ".py") return "python";
    if (ext === ".js" || ext === ".jsx") return "js";
    if (ext === ".ts" || ext === ".tsx") return "js";
    if (ext === ".java") return "java";
    if (ext === ".go") return "go";
    if (ext === ".rs") return "rust";
    if (ext === ".cpp" || ext === ".cxx") return "cpp";
    if (ext === ".md") return "markdown";
  
    return null;
}

function getSplitterForFile(filePath: string) {
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

export async function splitRepoToDocuments(repoRoot: string, repoId: string) {
    const files = getFilePath(repoRoot);
    const allChunks: Document[] = [];
  
    for (const file of files) {
      const relPath = path.relative(repoRoot, file).replaceAll("\\", "/");
      const text = fs.readFileSync(file, "utf8").trim();
      if (!text) continue;
  
      const splitter = getSplitterForFile(file);
  
      const chunks = await splitter.createDocuments([text],[{repo_id : repoId, file_path : relPath}]);
  
      chunks.forEach((d:Document, i:number) => {
        d.metadata.chunk_index = i;
        d.metadata.chunk_id = sha256(`${repoId}|${relPath}|${i}`);
      });
  
      allChunks.push(...chunks);
    }
  
    return allChunks;
}

async function upsertToSupabase(params: {
  docs: Document[];
  supabaseUrl: string;
  supabaseKey: string;
  openAIApiKey: string;
  tableName: string;
  userId?: string;
}) {
  const { docs, supabaseUrl, supabaseKey, openAIApiKey, tableName, userId } = params;

  const client = createClient(supabaseUrl, supabaseKey);
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  
  const BATCH_SIZE = 64;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);

    const texts = batch.map(d => d.pageContent);
    const vectors = await embeddings.embedDocuments(texts);

    // 2) Map into your DB schema rows
    const rows = batch.map((d, idx) => {
      const repo_id = d.metadata.repo_id as string;
      const file_path = d.metadata.file_path as string;
      const chunk_index = d.metadata.chunk_index as number;
      const chunk_id = d.metadata.chunk_id as string;

      return {
        repo_id,
        file_path,
        chunk_index,
        chunk_id,
        content: d.pageContent,
        metadata: d.metadata,
        embedding: vectors[idx],
        user_id: userId ?? null,
      };
    });

    
    const { error } = await client
      .from(tableName)
      .upsert(rows, { onConflict: "chunk_id" });

    if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
  }
}

export const downloadController = (req: Request, res: Response, next: NextFunction) => {
  const repoUrl = req.query.repolink;

  const userId = req.user?.user_id;

  if (!repoUrl || typeof repoUrl !== "string") {
    return res.status(400).json({ message: "repo query param required" });
  }

  const repoName = path.basename(repoUrl, ".git");
  const destFolder = path.join(__dirname, "..", "downloaded_repos", repoName);

  
  if (fs.existsSync(destFolder)) fs.rmSync(destFolder, { recursive: true, force: true });
  fs.mkdirSync(destFolder, { recursive: true });

  exec(`git clone ${repoUrl} ${destFolder}`, async (err) => {
    if (err) return res.status(500).json({ message: err.message });

    // console.log("Got past first 500 error")

    try {
      const sbApiKey = process.env.SUPABASE_API_KEY!;
      const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT!;
      const openAIApiKey = process.env.OPENAI_API_KEY!;
      if (!sbApiKey || !sbUrl || !openAIApiKey) {
        return res.status(500).json({ message: "Missing env vars (SUPABASE_API_KEY, SUPABASE_URL_LC_CHATBOT, OPENAI_API_KEY)" });
      }

      const repoId = sha256(repoUrl);
      res.locals.repoID = repoId;

      const docs = await splitRepoToDocuments(destFolder, repoId);


      await upsertToSupabase({
        docs,
        supabaseUrl: sbUrl,
        supabaseKey: sbApiKey,
        openAIApiKey,
        tableName: "documents",
        userId,
      });

      // Pass repoId and userId to the next handler (llmRouter)
      res.locals.repoId = repoId;
      res.locals.userId = userId ?? null;

      next();
    } catch (e: any) {
      // return res.status(500).json({ message: e?.message ?? "Indexing failed" });
      console.error("Indexing failed:", e);
      next(e)
    }
  });
};