import {readFile,writeFile} from 'fs/promises';
import { join } from 'path';
// Load links from JSON file
// Function to serve files
const DATA_FILE = join("data", "links.json");
export const showData = async (filepath, contentType, res) => {
    try {
        const data = await readFile(filepath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Error: File Not Found");
    }
};
export const loadLinks = async () => {
    try {
        const data = await readFile(DATA_FILE, "utf-8");
        // Check if the file is empty
        if (!data.trim()) {
            await writeFile(DATA_FILE, JSON.stringify({}), "utf-8"); // Fix it
            return {};
        }
        return JSON.parse(data);
    } catch (err) {////////////////////////////////////////////////////////////////////////learn
        if (err.code === "ENOENT") {
            await writeFile(DATA_FILE, JSON.stringify({}), "utf-8");
            return {};
        }
        throw err;
    }
};

// Save links to JSON file
export const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links), "utf-8");
};

