import { useState, useContext, useEffect } from "react";
import { UpContext } from "Components/Context/UpContext";
import { getTransactionInformation } from "Components/Axios/AxiosCommands";

import { Card, Metric, Title, Subtitle, Bold, Italic, Text } from "@tremor/react";
import { Flex } from "@tremor/react";

import moment from "moment";
import { merchantResponse } from "Components/Axios/TypesAxios";


function TransactionIndividaul(){ // This component will list each each transaction information away from the home page..

    const {state,dispatch} = useContext(UpContext);

    const [info, setInfo] = useState<merchantResponse | null>(null);

    useEffect(() => {

        async function getTransactInformation(){
            await getTransactionInformation(state.transactionIndividual.attributes.description).then(result => setInfo(result)).catch(err => console.log(err))
        }

        getTransactInformation();


    }, [])


    return(
        <div className="p-5">

            <Card>
            <div className="d-flex flex-column">
            <div>
                <Card>

                    <h3>Transactional Information</h3>

                    <Title> Company Name: {state.transactionIndividual.attributes.description} </Title>

                    <Title> Transaction Date: {moment(state.transactionIndividual.attributes.createdAt).format('LLLL')}</Title>

                    <Title> Transaction Amount: ${Math.abs(parseFloat(state.transactionIndividual.attributes.amount.value))} </Title>

                    <Title> Transaction Type:  {state.transactionIndividual.type}</Title>

                    <br></br>

                    <Title> Transaction Message: {state.transactionIndividual.attributes.message ? state.transactionIndividual.attributes.message
                                                 : "No message provived"}</Title>

                    <Title> Transaction Category: {state.transactionIndividual.relationships.category.data.id}</Title>


                </Card>

            </div>

            <div>

                {info ? 

                 <Card>

                    <h3>Merchant Information</h3>

                    <img src={info.brandInfo.icon} alt = "Company Logo"></img>

                    <Title> <b>Company Website:</b> {info.domainInfo.domain} </Title>

                    <Title> <b>Company Description:</b> {info.domainInfo.description} </Title>

                    <Title> Transaction Date: {state.transactionIndividual.attributes.createdAt}</Title>

                    <Title> Transaction Amount: ${Math.abs(parseFloat(state.transactionIndividual.attributes.amount.value))} </Title>

                    <Title> Transaction Type:  {state.transactionIndividual.type}</Title>


                </Card>

                :

                 <Card>
                    <h3>Cannot reterive information for this merchant.</h3>
                 </Card>


                }


            </div>

            </div>

            </Card>




        </div>
    )

}

export default TransactionIndividaul;