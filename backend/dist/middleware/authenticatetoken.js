import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
export default function authenticateToken(req, res, next) {
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    if (!token) {
        // console.log("TOKEN DID NOT EXIST SENDING 401")
        return res.status(401).json({ message: 'Authentication Required' });
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or Expired Token" });
        }
        req.user = user;
        next();
    });
}
