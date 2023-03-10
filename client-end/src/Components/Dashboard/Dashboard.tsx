import React, {useState, useEffect} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';

/* Run relevant axios calls here to fetch information such as saving balances, transactional savings etc, then pass it down as props, 
to the relevant components */

import { getSavingsAccount, getTransactionalAccount, getTransactions } from "Components/Axios/AxiosCommands";
import { AccountResource, ListTransactionsResponse } from 'up-bank-api';




function Dashboard(){

  const [savingAccount,setSavingAccount] = useState<AccountResource | null>(null); 

  const [trasactionalAccount,setTrasactionalAccount] = useState<AccountResource | null>(null);

  const [transactions,setTransactions] = useState<ListTransactionsResponse | null>(null);


  useEffect(() => {

    async function getInformationUser(){

      await getSavingsAccount().then(result => setSavingAccount(result)).catch(err => console.log(err));

      await getTransactionalAccount().then(result => setTrasactionalAccount(result)).catch(err => console.log(err));

      await getTransactions().then(result => setTransactions(result)).catch(err => console.log(err));

    }

    getInformationUser();

  }, [])

    return(
        <div>

          <Accounts savings={savingAccount} transactional = {trasactionalAccount}/>
            
        </div>
    )


}

export default Dashboard;