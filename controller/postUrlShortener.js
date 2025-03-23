import { saveLinks,loadLinks } from "../model/model.js";
import {readFile,writeFile} from 'fs/promises';
import { join } from 'path';
export const postUrlShortner=async (req, res) => {
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

};

export const getUrlshortener=async (req, res) => {
    const links = await loadLinks();
return res.render('index',{links,host:req.hostname});
}
// export const getUrlshortener=async (req, res) => {
//     try {
//         const file = await readFile(join("views", "index.html"),"utf-8");
//         const links = await loadLinks();
//         let linksHTML = "<ul>";
//         for (const [shortCode, url] of Object.entries(links)) {
//             const truncatedUrl = url.length > 25 ? url.substring(0, 20) + "....." : url;
//             linksHTML += `<li><a href="/${shortCode}" target="_blank">${req.protocol}://${req.get("host")}/${shortCode}</a> → <span style="color:black;">${truncatedUrl}</span></li>`;
//         }
//         linksHTML += "</ul>";
//         const content=file.toString().replace("{{shorturls}}",linksHTML);
//         res.send(content);
//     }
//     catch(err) {
// console.log(err);
//         res.status(500).send("Internal Error unable to read");

//     }
// };

export const redirect=async (req,res)=>{
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
};
