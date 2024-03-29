import React, {useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { UpContext } from "Components/Context/UpContext";
import { convertDataForGraphs, generateTransactionSummaries } from "./functions";


import { Card, Title, BarChart, Subtitle, Metric, Divider } from "@tremor/react";
import moment from "moment";
import { TransactionResource } from "up-bank-api";

type summaryDataType = {
    month: string, 
    averageCost: string, 
    totalCost: string, 
    numberOfTransactions: string, 
    transactions: TransactionResource[]
}

function TransactionInsight(){

    const {state} = useContext(UpContext)
    const navigate = useNavigate();

    // If the user refreshes the browser they are navigated to the dashboard component 
    useEffect(() => {

        if(state.transactionInsight === null){
            navigate('/dashboard')
        }
        
    }, [navigate, state.transactionInsight])

    // Check if transactionInsight is null before rendering JSX
    if (!state.transactionInsight) {
        return null;
    }

    const chartdata = convertDataForGraphs(state.transactionInsight.transaction.pastTransactionsList)

    const summaryData : summaryDataType[] = generateTransactionSummaries(state.transactionInsight.transaction.pastTransactionsList)

    console.log(summaryData, "summartData")

    const dataFormatter = (number: number) => {
        return "$ " + Intl.NumberFormat("us").format(number).toString();
      };

    return (
        <div className="d-flex flex-column flex-gap-20 p-2">
          <Card>
            {state.transactionInsight.merchantInfo && (
              <div>
                <img
                  src={state.transactionInsight.merchantInfo.icon}
                  width={50}
                  alt="Company Logo"
                />
                <a
                  target="_blank"
                  href={state.transactionInsight.merchantInfo.domain}
                  rel="noreferrer"
                >
                  {state.transactionInsight.merchantInfo.domain}
                </a>
              </div>
            )}
            <Title>
              Total Money Spent at {state.transactionIndividual.attributes.description}
            </Title>
            <Subtitle>
              This shows your transactions from the last 12 months at{" "}
              {state.transactionIndividual.attributes.description}
            </Subtitle>
            <BarChart
              data={chartdata}
              dataKey={"month"}
              categories={["spend"]}
              colors={["blue"]}
              valueFormatter={dataFormatter}
              yAxisWidth={"w-10"}
            />
    
            <div className="d-flex justify-content-around align-items-center p-5">
              <div className="d-flex flex-column align-items-center">
                <Metric>
                  {state.transactionInsight.transaction.transactionSummary.numberOfTransactions}
                </Metric>
                <Subtitle>Transactions</Subtitle>
              </div>
    
              <div className="d-flex flex-column align-items-center">
                <Metric>
                  ${state.transactionInsight.transaction.transactionSummary.averageOfTransactions.toFixed(
                    2
                  )}
                </Metric>
                <Subtitle>Average</Subtitle>
              </div>
    
              <div className="d-flex flex-column align-items-center">
                <Metric>
                  ${state.transactionInsight.transaction.transactionSummary.sumOfTransactions.toFixed(
                    2
                  )}
                </Metric>
                <Subtitle>All time</Subtitle>
              </div>
            </div>
          </Card>
    
          <Card>
            {summaryData.map((item) => (
              <div key={item.month}>
                <Metric color="blue">{item.month}</Metric>
                <div className="d-flex flex-gap-20 align-items-center p-3">
                  <div className="d-flex flex-column align-items-center">
                    <Title color="blue">{item.numberOfTransactions}</Title>
                    <Title>Transactions</Title>
                  </div>
    
                  <div className="d-flex flex-column align-items-center">
                    <Title color="blue">${item.averageCost}</Title>
                    <Title>Average</Title>
                  </div>
    
                  <div className="d-flex flex-column align-items-center">
                    <Title color="blue">${item.totalCost}</Title>
                    <Title>Total Cost</Title>
                  </div>
                </div>
    
                {item.transactions.map((transaction) => (
                  <div className="d-flex flex-gap-20 p-4" key={transaction.id}>
                    <div className="d-flex flex-column align-items-center">
                      <Title>
                        <li>
                          {moment(transaction.attributes.createdAt).format("LLL")}
                        </li>
                      </Title>
                      <Subtitle>{transaction.attributes.rawText}</Subtitle>
                    </div>
    
                    <div className="text-center">
                      <p>${Math.abs(parseFloat(transaction.attributes.amount.value))}</p>
                    </div>
                  </div>
                ))}
    
                <Divider />
              </div>
            ))}
          </Card>
        </div>
      );
    }

export default TransactionInsight;