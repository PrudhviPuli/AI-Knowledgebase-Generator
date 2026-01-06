import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url";

const __filename:string = fileURLToPath(import.meta.url)
const __dirname:string = path.dirname(__filename)
dotenv.config({path: path.resolve(__dirname, '../../.env')});

const supabase_url = process.env.SUPABASE_URL_LC_CHATBOT as string;
const supabase_key = process.env.SUPABASE_API_KEY as string;

const supabase = createClient(supabase_url, supabase_key)

export default supabase;