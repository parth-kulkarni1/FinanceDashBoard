import express, { Router } from "express";
import { router } from "./Routes/Routes";

const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors')
const cors_options = {
  origin: "http://localhost:3000",
  credentials: true
}


app.use(express.json());
app.use(cors(cors_options))
app.use(router)
app.set('trust proxy', 1)

app.listen(port, () => console.log("sucessfully created on port 4000"));


