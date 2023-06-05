import React, {useEffect, useContext} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';
import { getMonthlyTransactionalTotal, getSavingsAccount, getTransactionalAccount, getTransactions } from "Components/Axios/AxiosCommands";
import TransactionsTable from 'Components/TransactionalTable/TransactionalTable';
import { UpContext } from 'Components/Context/UpContext';
import MonthlyGraphs from 'Components/MonthlyGraphs/MonthlyGraphs';

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

  }, [dispatch])

    return(
        <div>

          <Accounts />

          <div className='d-flex flex-gap-20  p-2'>
            <TransactionsTable />
            <MonthlyGraphs />

          </div>
            
        </div>
    )


}

export default Dashboard;