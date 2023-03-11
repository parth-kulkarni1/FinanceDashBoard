import React, {useEffect, useState} from "react";

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
import axios from "axios";

interface TransactionsTableProps{
    transactions: ListTransactionsResponse
}

function TransactionsTable(props: TransactionsTableProps){

    const [transactions, setTransactions] = useState<ListTransactionsResponse | null>(props.transactions)

    useEffect(() =>{

        setTransactions(props.transactions)

    }, [props.transactions])

    async function handleNext(){
        const link = transactions.links.next;

        if(!link){ // Link exists and is not null

            const result = axios.get('/transactions')




        }


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

                    </TableRow>
                </TableHead>


                <TableBody>
                    {transactions.data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {item.attributes.description}
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

                        </TableRow>



                    ))}



                </TableBody>


            </Table>


            <Flex>
            <Button disabled = {transactions.links.prev ? false : true}>Previous</Button>


            <Button onClick={handleNext}>Next</Button>

            </Flex>





        </Card>

                    }

</div>




    )

}

export default TransactionsTable;

