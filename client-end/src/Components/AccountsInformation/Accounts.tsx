import React, {useState, useEffect} from "react";


import { Card, Metric, Text, Flex } from "@tremor/react";
import { AccountResource } from "up-bank-api";


interface AccountsProps{
    savings: AccountResource,
    transactional: AccountResource,
    monthlyTotal: string
}


function Accounts(props: AccountsProps){


    return(
        <div>

                {!!props.savings && !!props.transactional && 

                <div>
       
                <Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">

                    <Flex>

                        <div>

                            <Text>{props.transactional.attributes.displayName} Account</Text>
                            <Metric>${props.transactional.attributes.balance.value}</Metric>


                        </div>

                        <div>
           
                            <Text>{props.savings.attributes.displayName} Account</Text>
                            <Metric>${props.savings.attributes.balance.value}</Metric>
        
                        </div>


                    
                    </Flex>

                </Card>


<div>

<Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">

    <Text>Your Current Monthly Spend Is: </Text>

    <Metric>$ {props.monthlyTotal}</Metric>


</Card>

</div>

</div>

                }

        </div>

 


    )

}


export default Accounts;