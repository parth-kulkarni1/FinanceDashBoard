import React, {useContext, useState} from "react";
import {useNavigate } from "react-router-dom";
import { getNextTransaction } from "Components/Axios/AxiosCommands";
import { UpContext } from "Components/Context/UpContext";

import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Title,
  Button,
  Flex,
} from "@tremor/react";

import { Modal } from "react-bootstrap";

import moment from 'moment';



function TransactionsTable(){

    const {state, dispatch} = useContext(UpContext)

    const [showModal, setModal] = useState<boolean>(false);


    const naviagte = useNavigate();


    async function handlePagination(event: React.FormEvent<HTMLButtonElement>){

        let link = ""

        if(event.currentTarget.value === "prev"){
            link = state.transactionsList.links.prev
        }

        else{
            link = state.transactionsList.links.next
        }

        if(link){ // Link exists and is not null

            const result = await getNextTransaction(link)

            dispatch({type: 'getTransactions', payload: result})

        }

    }

    function handleTransfer(event: React.FormEvent<HTMLButtonElement>){

        const transaction = state.transactionsList.data.find(item => item.id === event.currentTarget.value)

        dispatch({type: 'transactionIndividual', payload: transaction})

        setModal(true)

    }


    function handleTransaction(event:React.FormEvent<HTMLButtonElement>){

        const transaction = state.transactionsList.data.find(item => item.id === event.currentTarget.value)

        dispatch({type: 'transactionIndividual', payload: transaction })

        naviagte(`/transaction/${transaction.id}`)

    }



    return(

        <div className="pb-5">

        {state.transactionsList &&

        <Card marginTop="mt-10" maxWidth="max-w-4xl">

            <Title>List of Transactions</Title>

            <Table marginTop="mt-5">

                <TableHead>
                    <TableRow>
                        <TableHeaderCell>
                            Description
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Currency Code
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Value
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Foregin Amount
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Status
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Date
                        </TableHeaderCell>

                    </TableRow>
                </TableHead>

               

                <TableBody>
                    {state.transactionsList.data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>

                                {item.relationships.transferAccount.data || item.attributes.amount.valueInBaseUnits >=0 ? 

                                    <Button size="xs" value={item.id} variant="light" onClick={handleTransfer}>
                                    {item.attributes.description}</Button>

                                    :
                                    <Button size="xs" value={item.id} variant="light" onClick={handleTransaction}>
                                    {item.attributes.description}</Button>


                            }


                           </TableCell>

                            <TableCell>
                                {item.attributes.amount.currencyCode}
                            </TableCell>
                            
                            <TableCell>
                                {item.attributes.amount.value}
                            </TableCell>

                            <TableCell>
                                {!item.attributes.foreignAmount ? "N/A" : item.attributes.foreignAmount.currencyCode}
                            </TableCell>

                            <TableCell>
                                {item.attributes.status}
                            </TableCell>

                            <TableCell>
                                {moment(item.attributes.createdAt).format('LL')}
                            </TableCell>

                        </TableRow>



                    ))}
                    



                </TableBody>

                


            </Table>


            <Flex>
            <Button disabled = {state.transactionsList.links.prev ? false : true} value = "prev" onClick={handlePagination}>Previous</Button>


            <Button disabled = {state.transactionsList.links.next ? false : true} value = "next" onClick={handlePagination}>Next</Button>

            </Flex>





        </Card>

        }

        {showModal && 

            <Modal show={showModal} onHide={() => setModal(false)} centered={true}> 
                <Modal.Header closeButton>
                    <Modal.Title>{state.transactionIndividual.attributes.description}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{state.transactionIndividual.attributes.amount.value}</Modal.Body>
                
            
            </Modal>
        
        }



</div>




    )

}

export default TransactionsTable;

