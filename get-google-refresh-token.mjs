import { google } from "googleapis";
import readline from "node:readline";

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Load environment variables from .env.local if present
const envPath = resolve(process.cwd(), "apps/web/.env.local");
if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const parts = trimmed.split("=");
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
            process.env[key] = val;
        }
    }
}

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/callback"
);

const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
});

console.log("\nAbra esta URL no navegador:\n");
console.log(authUrl);
console.log("\nDepois cole aqui o parâmetro 'code' retornado pelo Google.\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Code: ", async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);

        console.log("\n===============================");
        console.log("GOOGLE_REFRESH_TOKEN");
        console.log("===============================\n");
        console.log(tokens.refresh_token);
        console.log("\n===============================\n");

        rl.close();
    } catch (err) {
        console.error(err);
        rl.close();
    }
});
