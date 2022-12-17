import express from "express";
import { Request, Response } from "express";
import axios from "axios"
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

const options = {
    headers: {
        Authorization: `Bearer ${process.env.TOKEN}`
    }
}

app.use(express.json());


app.get('/accounts', async function (req: Request, res: Response) {

    const url = "https://api.up.com.au/api/v1/accounts"
   
   const {data} : any =  await axios.get(url, options);

   console.log(data, "Data")


   res.send(data)

    
})

app.listen(port, () => console.log("sucessfully created on port 4000"));


