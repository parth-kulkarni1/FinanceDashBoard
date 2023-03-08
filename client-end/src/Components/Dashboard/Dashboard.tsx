import React, {useState, useEffect} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';

/* Run relevant axios calls here to fetch information such as saving balances, transactional savings etc, then pass it down as props, 
to the relevant components */

import { getSavingBalance } from "Components/Axios/AxiosCommands";




function Dashboard(){


  useEffect(() => {

    async function getSaving(){

      const savingBalance = await getSavingBalance();


    }

  }, [])

    return(
        <div>

          <Accounts />
            
        </div>
    )


}

export default Dashboard;