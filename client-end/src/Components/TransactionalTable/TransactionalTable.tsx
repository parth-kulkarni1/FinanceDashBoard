import React, {useEffect, useState} from "react";
import {useNavigate } from "react-router-dom";
import { getNextTransaction } from "Components/Axios/AxiosCommands";


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

import {ListTransactionsResponse } from "up-bank-api";

interface TransactionsTableProps{
    transactions: ListTransactionsResponse
}

function TransactionsTable(props: TransactionsTableProps){

    const [transactions, setTransactions] = useState<ListTransactionsResponse | null>(props.transactions)

    const naviagte = useNavigate();

    useEffect(() =>{

        setTransactions(props.transactions)

    }, [props.transactions])

    async function handlePagination(event: React.FormEvent<HTMLButtonElement>){

        let link = ""

        if(event.currentTarget.value === "prev"){
            link = transactions.links.prev
        }

        else{
            link = transactions.links.next
        }

        if(link){ // Link exists and is not null

            const result = await getNextTransaction(link)

            setTransactions(result)

        }

    }


    function handleTransaction(event: React.FormEvent<HTMLElement>){

        naviagte(`/transaction/${event.currentTarget.id}`)

    }



    return(

        <div>

        {!!transactions &&

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
                    {transactions.data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                   <p id = {item.id} onClick={handleTransaction}>{item.attributes.description}</p>

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
                                {item.attributes.createdAt}
                            </TableCell>

                        </TableRow>



                    ))}



                </TableBody>


            </Table>


            <Flex>
            <Button disabled = {transactions.links.prev ? false : true} value = "prev" onClick={handlePagination}>Previous</Button>


            <Button disabled = {transactions.links.next ? false : true} value = "next" onClick={handlePagination}>Next</Button>

            </Flex>





        </Card>

                    }

</div>




    )

}

export default TransactionsTable;

