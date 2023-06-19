import express, { Router } from "express";
import { router } from "./Routes/Routes";
import session from "express-session";
import helmet from 'helmet'


const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors')
const cors_options = {
  origin: "https://main--stately-crisp-41befd.netlify.app",
  credentials: true
}


app.use(express.json());
app.use(cors(cors_options)) 
app.use(helmet())


app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 900000,
      secure: true, // Set 'secure' to true to ensure the cookie is sent only over HTTPS
      sameSite: 'none',
    },
    resave: false,
  })
);

// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);

app.use(router)

app.listen(port, () => console.log("sucessfully created on port 4000"));

module.exports = app

