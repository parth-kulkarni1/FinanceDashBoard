import React, {useState, useContext, useEffect} from "react";

import { Card, BarChart, Title, DonutChart, List, ListItem } from "@tremor/react";
import { Button } from "react-bootstrap";
import { getMonthlySummary, getMonthlyCategorySummary, getMonthlyPopularCompanies } from "Components/Axios/AxiosCommands";
import { getLastTwelveMonthsWithYears } from "Components/TransactionInsight/functions";
import { Dropdown, DropdownItem } from "@tremor/react";



import moment from "moment";

type Categorical = {
    category: string,
    totalSpent: number
}

type MonthlyData = {
    income: number, 
    spending: number
}


function MonthlyGraphs(){

    const lastTwelveMonths = getLastTwelveMonthsWithYears();

    const [monthlyData, setMonthlyData] = useState<MonthlyData[] | null>(null);
    const [monthlyCategoricalData, setMonthlyCategoicalData] = useState<Categorical[] | null>(null)

    const [selectedMonth, setSelectedMonth] = useState<string>('')
    const [selectedMonthCategory, setSelectedMonthCategory] = useState<string>('')

    const [monthlyPopularTrips, setMonthlyPopularTrips] = useState<any>();
    const [selectedMonthPopularItems, setSelecteMonthPopularItems] = useState<string>('')

    const dataFormatter = (number: number) => {
        return "$ " + Intl.NumberFormat("us").format(number).toString();
      };

    useEffect(() => {
                
        async function handleMonthlyGraph(){

            const currentMonthString = moment().startOf('month').format('MMMM YYYY')

            const data = await getMonthlySummary(currentMonthString);

            setMonthlyData(data)
            setSelectedMonth(currentMonthString)

        }

        async function getCategorySummary(){
            const currentMonthString = moment().startOf('month').format('MMMM YYYY')

            const data = await getMonthlyCategorySummary(currentMonthString)

            setMonthlyCategoicalData(data)
            setSelectedMonthCategory(currentMonthString)

        }


        async function getTop10Companies(){
            const currentMonthString = moment().startOf('month').format('MMMM YYYY')

            const data = await getMonthlyPopularCompanies(currentMonthString)

            setMonthlyPopularTrips(data);
            setSelecteMonthPopularItems(currentMonthString)


        }

        handleMonthlyGraph();
        getCategorySummary();
        getTop10Companies();


    }, [])


    async function handleRequestedMonth(event: React.FormEvent<HTMLButtonElement>){

        const month = event.currentTarget.id
        const data = await getMonthlySummary(month)
        setMonthlyData(data)
        setSelectedMonth(month)

    }

    async function handleRequestedCategoryMonth(event: React.FormEvent<HTMLButtonElement>){

        const month = event.currentTarget.id
        const data = await getMonthlyCategorySummary(month)
        setMonthlyCategoicalData(data)
        setSelectedMonthCategory(month)
    }

    async function handleRequestedPopularItemsMonth(event: React.FormEvent<HTMLButtonElement>){

        const month = event.currentTarget.id
        const data = await getMonthlyPopularCompanies(month)
        setMonthlyPopularTrips(data)
        setSelecteMonthPopularItems(month)
    }


    return(

        <div className="d-flex flex-column flex-gap-20">

        {monthlyData && 

        <Card marginTop="mt-10">

            <div className="d-flex justify-content-between">
                <Title>Spending vs income for {selectedMonth} </Title>
            </div>

            <div className="p-3">
            <BarChart
            data={monthlyData}
            dataKey={'status'}
            categories={["income","spending"]}
            colors={["blue", "pink"]}
            valueFormatter={dataFormatter}
            yAxisWidth={"w-12"}
        
            />
            </div>

            <div className="d-flex justify-content-around flex-gap-20">
                {lastTwelveMonths.map((month) => 
                    <Button variant={month === selectedMonth ? "warning" : "success"} onClick={handleRequestedMonth} id={month}>{moment(month).format('MMMM')}</Button> 
                )}
            </div>

        </Card>

        }


        {monthlyCategoricalData && 

        <Card>

            <div className="d-flex justify-content-between">
                <Title>Categorical Spending for {selectedMonthCategory}</Title>
                <Button>View more about {selectedMonthCategory}</Button>

            </div>


            <div className="p-3">
                <DonutChart
                data={monthlyCategoricalData}
                category={"totalSpent"}
                dataKey={"category"}
                valueFormatter={dataFormatter}
                showLabel = {true}
                
                />
                

            </div>

            <div className="d-flex justify-content-around flex-gap-20">
                {lastTwelveMonths.map((month) => 
                    <Button variant={month === selectedMonthCategory ? "warning" : "success"} onClick={handleRequestedCategoryMonth} id={month}>{moment(month).format('MMMM')}</Button> 
                )}
            </div>



        </Card>

        }



        {monthlyPopularTrips && 

        <Card>
            <Title>Top 5 Visited Places in {selectedMonthPopularItems}</Title>

            <List>
                {monthlyPopularTrips.map((company, index) => (
                    <ListItem key = {company.companyName}>

                        <span> {index + 1} - {company.companyName}</span>
                        <span>Vist : {company.frequency} in {selectedMonthPopularItems}</span>

                    </ListItem>
                ))}

            </List>

            <br></br>

            
            <div className="d-flex justify-content-around flex-gap-20">
                {lastTwelveMonths.map((month) => 
                    <Button variant={month === selectedMonthPopularItems ? "warning" : "success"} onClick={handleRequestedPopularItemsMonth} id={month}>{moment(month).format('MMMM')}</Button> 
                )}
            </div>
        
        </Card>

        }


        </div>


    )

}

export default MonthlyGraphs;