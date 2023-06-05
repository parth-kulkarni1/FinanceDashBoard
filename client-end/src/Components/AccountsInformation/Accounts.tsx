import React, {useContext} from "react";

import { UpContext } from "Components/Context/UpContext";

import { Card, Metric, Text} from "@tremor/react";


function Accounts(){

    const {state}= useContext(UpContext);

    return(

            state.savingsAccountBalance && state.trasactionalAccountBalance &&

                <div className="d-flex">
       
                    <Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">
                        <Text>{state.trasactionalAccountBalance.attributes.displayName} Account</Text>
                        <Metric>${state.trasactionalAccountBalance.attributes.balance.value}</Metric>
                    </Card>


                    <Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">
                        <Text>{state.savingsAccountBalance.attributes.displayName} Account</Text>
                        <Metric>${state.savingsAccountBalance.attributes.balance.value}</Metric>
                    </Card>



                    <Card maxWidth="max-w-md" marginTop="mt-5" decoration="top" decorationColor="indigo">
                        <Text>Your Current Monthly Spend Is: </Text>
                        <Metric>$ {state.monthlySpendingTotal}</Metric>
                    </Card>

                </div>



    )}


export default Accounts;