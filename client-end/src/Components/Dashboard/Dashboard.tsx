import React, {useEffect, useContext} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';
import {getMonthlyTransactionalTotal, getSavingsAccount, getTransactionalAccount, getTransactions } from "Components/Axios/AxiosCommands";
import TransactionsTable from 'Components/TransactionalTable/TransactionalTable';
import { UpContext } from 'Components/Context/UpContext';
import MonthlyGraphs from 'Components/MonthlyGraphs/MonthlyGraphs';
import { userContext } from 'Components/Context/UserContext';
import { useNavigate } from 'react-router-dom';

/* Import of 3rd party libraries */ 

function Dashboard(){

  const {dispatch} = useContext(UpContext);
  const {setUser} = useContext(userContext)
  const navigate = useNavigate();

  useEffect(() => {

    async function getInformationUser(){

      // Let's initially check if the session has expired or not before proceeding to call these methods 

      await getSavingsAccount().then(result => dispatch({type: 'savingAccountBalance', payload:result})).catch(err => console.log(err))

      await getTransactionalAccount().then(result => dispatch({type: 'transactionalAccountBalance', payload: result})).catch(err => console.log(err));

      await getTransactions().then(result => dispatch({type: 'getTransactions', payload: result})).catch(err => console.log(err));

      await getMonthlyTransactionalTotal().then(result => dispatch({type: 'getMonthlySpending', payload:result})).catch(err => console.log(err));
     
    }

    getInformationUser();

  }, [dispatch, navigate, setUser])

    return(
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <Accounts />
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6'>
            <div className='p-2'>
              <TransactionsTable />
            </div>
          </div>

        <div className='col-md-6'>
          <div className='p-2' style={{ height: '500px' }}>
            <MonthlyGraphs />
          </div>
        </div>
      </div>

    </div>

    
    
    )


}

export default Dashboard;