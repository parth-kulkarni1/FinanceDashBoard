import React, {useEffect, useContext} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';

/* Run relevant axios calls here to fetch information such as saving balances, transactional savings etc, then pass it down as props, 
to the relevant components */

import { getMonthlyTransactionalTotal, getSavingsAccount, getTransactionalAccount, getTransactions } from "Components/Axios/AxiosCommands";
import TransactionsTable from 'Components/TransactionalTable/TransactionalTable';
import { UpContext } from 'Components/Context/UpContext';




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


    return(
        <div>
          <Accounts />
          <TransactionsTable />
            
        </div>
    )


}

export default Dashboard;