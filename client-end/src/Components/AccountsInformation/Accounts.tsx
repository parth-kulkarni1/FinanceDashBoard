import React, {useState, useEffect} from "react";
import { getAllAccounts } from 'Components/Axios/AxiosCommands';


import { Card, Metric, Text, Flex } from "@tremor/react";
import { AccountResource } from "up-bank-api";


function Accounts(){


    return(
        <div>
       
                <Card maxWidth="max-w-xs" marginTop="mt-5" decoration="top" decorationColor="blue">
                  
                </Card>

        </div>
    )

}


export default Accounts;