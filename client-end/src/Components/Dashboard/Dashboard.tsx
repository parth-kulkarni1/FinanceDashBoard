import React, {useEffect, useContext} from 'react';

/* Importing of components */
import Accounts from 'Components/AccountsInformation/Accounts';
import {checkTokenValidity, getMonthlyTransactionalTotal, getSavingsAccount, getTransactionalAccount, getTransactions } from "Components/Axios/AxiosCommands";
import TransactionsTable from 'Components/TransactionalTable/TransactionalTable';
import { UpContext } from 'Components/Context/UpContext';
import MonthlyGraphs from 'Components/MonthlyGraphs/MonthlyGraphs';
import { useNavigate } from 'react-router-dom';
import { userContext } from 'Components/Context/UserContext';

function Dashboard(){

  const {dispatch} = useContext(UpContext);
  const {setUser} = useContext(userContext)
  const navigate = useNavigate();
  
  useEffect(() => {

    async function getInformationUser(){

      // Let's initially check if the session has expired or not before proceeding to call these methods 

      const response = await checkTokenValidity(); // Make an API request to your backend to check token validity

      if(response !== true){

        // This means that the token has expired

        localStorage.removeItem('token') // Remove the token 

        setUser(null) // Null the user

        navigate('/') // Navigate user to home page
       
        return 

        // Return from method to prevent calling other promises below.
        
      }

      
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