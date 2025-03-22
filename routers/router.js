import { Router } from "express";
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";
import { join } from "path";
const router=Router();
const DATA_FILE = join("data", "links.json");

// Function to serve files
const showData = async (filepath, contentType, res) => {
    try {
        const data = await readFile(filepath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Error: File Not Found");
    }
};

// Load links from JSON file
const loadLinks = async () => {
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
const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links), "utf-8");
};


router.get("/", async (req, res) => {
    try {
        const file = await readFile(join("views", "index.html"),"utf-8");
        const links = await loadLinks();
        let linksHTML = "<ul>";
        for (const [shortCode, url] of Object.entries(links)) {
            const truncatedUrl = url.length > 25 ? url.substring(0, 20) + "....." : url;
            linksHTML += `<li><a href="/${shortCode}" target="_blank">${req.protocol}://${req.get("host")}/${shortCode}</a> → <span style="color:black;">${truncatedUrl}</span></li>`;
        }
        linksHTML += "</ul>";
        const content=file.toString().replace("{{shorturls}}",linksHTML);
        res.send(content);
    }
    catch(err) {
console.log(err);
        res.status(500).send("Internal Error unable to read");

    }
});

router.post("/", async (req, res) => {
    try {
        const url= req.body.url;
        const shortCode  = req.body.shorturl;
        const links = JSON.parse(await readFile(join("data", "links.json"), "utf-8"));

        if (!url) {
            return res.status(500).send("Please Enter Url");
        }
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
        if (links[finalShortCode]) {
            return res.status(500).send("Already Exists");
        }

        links[finalShortCode] = url;
        await saveLinks(links);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }

});
router.get("/:shortcode",async (req,res)=>{
    try{
        const shortCode=req.params.shortcode;
        const links=await loadLinks();
        if(!links[shortCode]){
            return res.status(404).send("Not Found");
        }
        
            res.redirect(links[shortCode]);
        
    }
    catch{
        res.status(500).send("Internal Error");
    }
});
export const route=router;