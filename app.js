import express from 'express';
import { route } from './routers/router.js';
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.use(route);

// Start server
app.listen(3000, () => {
    console.log("Listening at port 3000");
});