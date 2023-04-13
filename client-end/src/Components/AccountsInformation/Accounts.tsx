import React, {useContext} from "react";

import { UpContext } from "Components/Context/UpContext";

import { Card, Metric, Text, Flex } from "@tremor/react";


function Accounts(){

    const {state}= useContext(UpContext);

    return(
        <div>

            {state.savingsAccountBalance && state.trasactionalAccountBalance &&

                <div>
       
                <Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">

                    <Flex>

                        <div>

                            <Text>{state.trasactionalAccountBalance.attributes.displayName} Account</Text>
                            <Metric>${state.trasactionalAccountBalance.attributes.balance.value}</Metric>


                        </div>

                        <div>
           
                            <Text>{state.savingsAccountBalance.attributes.displayName} Account</Text>
                            <Metric>${state.savingsAccountBalance.attributes.balance.value}</Metric>
        
                        </div>


                    
                    </Flex>

                </Card>


                <div>

                    <Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">

                        <Text>Your Current Monthly Spend Is: </Text>

                        <Metric>$ {state.monthlySpendingTotal}</Metric>
                    </Card>

                </div>

                </div>

            }

        </div>

    )}


export default Accounts;