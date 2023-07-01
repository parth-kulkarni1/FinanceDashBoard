import express, { Router } from "express";
import { router } from "./Routes/Routes";

const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors')
const cors_options = {
  origin: ["https://up-bank-dashboard.netlify.app", "https://up-bank-dashboard.netlify.app/", "http://localhost:3000/","http://localhost:3000"],
  credentials: true
}

app.use(express.json());
app.use(cors(cors_options));

// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);


app.use(router);

app.listen(port, () => console.log("successfully created on port 4000"));

module.exports = app;
