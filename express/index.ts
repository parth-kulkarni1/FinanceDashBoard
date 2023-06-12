import express, { Router } from "express";
import { router } from "./Routes/Routes";
import session from "express-session";
import helmet from 'helmet'


const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors')
const cors_options = {
  origin: "http://localhost:3000",
  credentials: true
}


app.use(express.json());
app.use(cors(cors_options)) 
app.use(helmet())

app.use(
  session({
      secret: 'keyboard cat',
      saveUninitialized: false, // Sets a cookie in the browser by default .. true for now
      cookie: { httpOnly: true, maxAge:900000, secure: 'auto', sameSite: 'strict'},
      resave: false, 
  }),
);

app.use(router)
app.set('trust proxy', 1)

app.listen(port, () => console.log("sucessfully created on port 4000"));

module.exports = app

