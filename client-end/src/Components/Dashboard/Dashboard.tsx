import React, {useEffect, useContext} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';
import { getMonthlyTransactionalTotal, getSavingsAccount, getTransactionalAccount, getTransactions, getMonthlySummary } from "Components/Axios/AxiosCommands";
import TransactionsTable from 'Components/TransactionalTable/TransactionalTable';
import { UpContext } from 'Components/Context/UpContext';
import { Button, Card } from 'react-bootstrap';

/* Import of 3rd party libraries */ 




function Dashboard(){

  const {dispatch} = useContext(UpContext);


  useEffect(() => {

    async function getInformationUser(){

      await getSavingsAccount().then(result => dispatch({type: 'savingAccountBalance', payload:result})).catch(err => console.log(err))

      await getTransactionalAccount().then(result => dispatch({type: 'transactionalAccountBalance', payload: result})).catch(err => console.log(err));

      await getTransactions().then(result => dispatch({type: 'getTransactions', payload: result})).catch(err => console.log(err));

      await getMonthlyTransactionalTotal().then(result => dispatch({type: 'getMonthlySpending', payload:result})).catch(err => console.log(err));
     

    }

    getInformationUser();

  }, [])

  async function handleMonthlyGraph(){

    const data = await getMonthlySummary();

    console.log(data)

  }


    return(
        <div>

          <Card>
            <Button>March</Button>
            <Button>March</Button>

          </Card>


          <Accounts />
          <TransactionsTable />
            
        </div>
    )


}

export default Dashboard;