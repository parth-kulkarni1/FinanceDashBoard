import React, {useState, useEffect, useContext} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';

/* Run relevant axios calls here to fetch information such as saving balances, transactional savings etc, then pass it down as props, 
to the relevant components */

import { getMonthlyTransactionalTotal, getSavingsAccount, getTransactionalAccount, getTransactions } from "Components/Axios/AxiosCommands";
import { AccountResource, ListTransactionsResponse } from 'up-bank-api';
import TransactionsTable from 'Components/TransactionalTable/TransactionalTable';
import { UpContext } from 'Components/Context/UpContext';




function Dashboard(){

  const [savingAccount,setSavingAccount] = useState<AccountResource | null>(null); 

  const [trasactionalAccount,setTrasactionalAccount] = useState<AccountResource | null>(null);

  const [transactions,setTransactions] = useState<ListTransactionsResponse | null>(null);

  const [transactionMonthlyTotal,setTransactionMonthlyTotal] = useState<string | null>(null);

  const {state,dispatch} = useContext(UpContext);


  useEffect(() => {

    async function getInformationUser(){

      await getSavingsAccount().then(result => setSavingAccount(result)).catch(err => console.log(err));

      await getTransactionalAccount().then(result => setTrasactionalAccount(result)).catch(err => console.log(err));

      await getTransactions().then(result => setTransactions(result)).catch(err => console.log(err));

      await getMonthlyTransactionalTotal().then(result => setTransactionMonthlyTotal(result)).catch(err => console.log(err));
      

    }

    getInformationUser();

  }, [])

    return(
        <div>

          <Accounts savings={savingAccount} transactional = {trasactionalAccount} 
                    monthlyTotal = {transactionMonthlyTotal}/>


          <TransactionsTable transactions={transactions} />
            
        </div>
    )


}

export default Dashboard;