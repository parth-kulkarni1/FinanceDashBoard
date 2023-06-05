import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UpContext } from "Components/Context/UpContext";
import { getTransactionInformation, getPreviousTransactions } from "Components/Axios/AxiosCommands";
import { merchantResponse, pastTransactionsHistory } from "Components/Axios/TypesAxios";

import { Card, Title, Subtitle, Divider } from "@tremor/react";
import moment from "moment";
import {SlSocialInstagram,SlSocialTwitter, SlSocialLinkedin, SlSocialFacebook,
        SlSocialYoutube} from "react-icons/sl"
import { Button } from "react-bootstrap";


function TransactionIndividaul(){ // This component will list each each transaction information away from the home page..

    const {state, dispatch} = useContext(UpContext);

    const [info, setInfo] = useState<merchantResponse | null>(null);

    const [previousTransactions, setPreviousTransactions] = useState<pastTransactionsHistory | null>(null);

    const navigate = useNavigate();

    useEffect(() => {



        async function getTransactInformation(){
            
            const merchantName = state.transactionIndividual.attributes.description; 
            const categoryName = state.transactionIndividual.relationships.category.data.id;

            await getTransactionInformation(state.transactionIndividual.attributes.description).then(result => setInfo(result))
                                            .catch(err => console.log(err))

            await getPreviousTransactions({merchantName: merchantName, categoryName: categoryName}).then(result => setPreviousTransactions(result))
                                         .catch(err => console.log("something gone wrong"))
        
        }

        
        if(state.transactionIndividual === null){
            navigate('/dashboard')
        }

        else{
            
            getTransactInformation();


        }


    }, [navigate, state.transactionIndividual])

    function handleInsightView(){

        dispatch({type: 'transactionInsight', payload: {merchantInfo: info.brandInfo, transaction: previousTransactions }})

        navigate(`/transaction/insight/${state.transactionIndividual.id}`)

    }


    return(

        <div className="p-5">

        {state.transactionIndividual && 

            <Card decoration="bottom" decorationColor="indigo">
              <div className="d-flex flex-column flex-gap-20">
               <div>
                <Card decoration="top" decorationColor="lime">

                    <div className="d-flex flex-gap-20 p-1">
                    <h3>Transactional Information</h3>

                    <Button variant = "primary"  disabled = {state.transactionIndividual.relationships.tags.data.length === 6}>
                        Add Tag to Transaction
                    </Button>

                    <Button variant = "primary" disabled = {state.transactionIndividual.relationships.tags.data.length === 0}>
                        Remove Tag From Transaction
                    </Button>

                    <Button variant = "primary">
                        Change Transaction Category
                    </Button>

                    </div>

                    <Divider />

                    <Title> Company Name: {state.transactionIndividual.attributes.description} </Title>

                    <Title> Location of Transaction: {state.transactionIndividual.attributes.rawText}</Title>

                    <Title> Transaction Date: {moment(state.transactionIndividual.attributes.createdAt).format('LLLL')}</Title>

                    <Title> Transaction Amount: ${Math.abs(parseFloat(state.transactionIndividual.attributes.amount.value))} </Title>

                    <Title> Transaction Type:  {state.transactionIndividual.type}</Title>

                    <br></br>

                    <Title> Transaction Message: {state.transactionIndividual.attributes.message ? state.transactionIndividual.attributes.message
                                                 : "No message provived"}</Title>

                    <Title> Transaction Category: {state.transactionIndividual.relationships.category.data.id}</Title>

                    {state.transactionIndividual.relationships.tags.data.length ? 

                        state.transactionIndividual.relationships.tags.data.map((tag) => 

                        <Title> Transaction Tags: {tag.id}</Title>

                        )

                        :

                        <Title> Transaction Tags: No tags provided for this transaction</Title>
                    
                
                }

                


                </Card>

            </div>

            <div>

                {info ? 

                    <Card  decoration="top" decorationColor="green">

                        <h3>Merchant Information</h3>

                        <Divider />

                        <img src={info.brandInfo.icon} alt = "Company Logo"></img>

                        <Title> <b>Company Website:</b> <a target="_blank" href={info.domainInfo.domain} rel="noreferrer">{info.domainInfo.domain}</a></Title>

                        <Title> <b>Company Description:</b> {info.domainInfo.description} </Title>


                        <Title> <b>Company Socials: </b></Title>

                        <div className="d-flex flex-gap-20 p-3 align-items-center justify-content-start flex-wrap">

                            {info.domainInfo.links.map((link) => (

                                <div>
                                    {

                                    link.name === "instagram" 
                                    ? (
                                        <div className="d-flex flex-gap-20 align-items-center">
                                            <Title>Instagram</Title>
                                            <SlSocialInstagram></SlSocialInstagram>
                                            <a target="_blank" href={link.url} rel="noreferrer"><Subtitle  color="indigo">{link.url}</Subtitle></a>
                                        </div>
                                    )
                                    : 
                                    link.name === "facebook" 
                                    ? (

                                        <div className="d-flex flex-gap-20 align-items-center">
                                            <Title>Facebook</Title>
                                            <SlSocialFacebook></SlSocialFacebook>
                                            <a target="_blank" href = {link.url} rel="noreferrer"><Subtitle color="indigo">{link.url}</Subtitle></a>
                                        </div>
                                        )
                                    :                         
                                    link.name === "youtube" 
                                    ? (

                                        <div className="d-flex flex-gap-20 align-items-center">

                                            <Title>Youtube</Title>
                                            <SlSocialYoutube></SlSocialYoutube>
                                            <a target="_blank" href={link.url} rel = "noreferrer"><Subtitle  color="indigo">{link.url}</Subtitle></a>
                                        </div>
                                    )
                                    
                                    : 
                                    link.name === "linkedin" 
                                    ? (
                                    
                                        <div className="d-flex flex-gap-20 align-items-center">

                                            <Title>Linkedin</Title>
                                            <SlSocialLinkedin></SlSocialLinkedin>
                                            <a target="_blank" href={link.url} rel = "noreferrer"><Subtitle color="indigo">{link.url}</Subtitle></a>
                                        </div>
                                    )
                                    : 
                                    link.name === "twitter" 
                                    ? (

                                        <div className="d-flex flex-gap-20 align-items-center">

                                            <Title>Twitter</Title>
                                            <SlSocialTwitter></SlSocialTwitter>
                                            <a target="_blank" href={link.url} rel = "noreferrer"><Subtitle  color="indigo">{link.url}</Subtitle></a>
                                        </div>
                                    
                                    )
                                    : 
                                    null

                                    }

                                </div>


                                

                            
                            ))}

                        </div>

                    </Card>

                :

                 <Card>
                    <h3>Cannot reterive information for this merchant.</h3>
                 </Card>
                }

            </div>

            <div className="d-flex ">

                <Card>

                    <h3>Summary of Past Transactions with {state.transactionIndividual.attributes.description}</h3>
                    <Divider />

                    {previousTransactions && 

                        <div className="d-flex flex-gap-20">
                        <Title> <b>Number of Transactions:</b> {previousTransactions.transactionSummary.numberOfTransactions}</Title>
                        
                        <Title> <b>Average Spend:</b> ${Math.round(previousTransactions.transactionSummary.averageOfTransactions)}</Title>

                        <Title> <b>Total Spend:</b> ${Math.round(previousTransactions.transactionSummary.sumOfTransactions)}</Title>

                        <Button onClick={handleInsightView} variant="success">View more</Button>

                        
                        </div>
                        

                    }

                </Card>


            </div>

        </div>

    </Card>

    }



        </div>
    )

}

export default TransactionIndividaul;