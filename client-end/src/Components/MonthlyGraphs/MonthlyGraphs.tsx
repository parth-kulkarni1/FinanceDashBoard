import React, {useState, useEffect,useContext} from "react";
import { getMonthlySummary, getMonthlyCategorySummary, getMonthlyPopularCompanies, getMonthlyCategoryDetailed } from "Components/Axios/AxiosCommands";
import { getLastTwelveMonthsWithYears } from "Components/TransactionInsight/functions";
import { UpContext } from "Components/Context/UpContext";
import { useNavigate } from "react-router-dom";

import { Card, BarChart, Title, DonutChart, List, ListItem } from "@tremor/react";
import { Button } from "react-bootstrap";
import { SelectBox, SelectBoxItem } from "@tremor/react";


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

    const {dispatch}= useContext(UpContext)
    const navigate = useNavigate();

    const lastTwelveMonths = getLastTwelveMonthsWithYears();

    const [value] = useState<string>('')

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


    async function handleRequestedMonth(value: string){

        const data = await getMonthlySummary(value)
        setMonthlyData(data)
        setSelectedMonth(value)

    }

    async function handleRequestedCategoryMonth(value:string){

        const data = await getMonthlyCategorySummary(value)
        setMonthlyCategoicalData(data)
        setSelectedMonthCategory(value)

    }

    async function handleRequestedPopularItemsMonth(value: string){

        const data = await getMonthlyPopularCompanies(value)
        setMonthlyPopularTrips(data)
        setSelecteMonthPopularItems(value)
    }

    async function handleExpandCategory(event: React.FormEvent<HTMLButtonElement>){

        const data = await getMonthlyCategoryDetailed(selectedMonthCategory)

        console.log("line 117 data", data)
    
        // Once the data is there then we add it to the global context and reterive in other component 
        dispatch({type:'categoryMonthlyDetailed', payload: data})

        navigate(`/category/${selectedMonthCategory}`)

        // Navigate to a certain component navigate(/....)

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

                <SelectBox value={value} onValueChange={handleRequestedMonth} placeholder="Select a month">

                    {lastTwelveMonths.reverse().map((month) => (

                        <SelectBoxItem key={month} value={month} text={month}  />
                        
                    ))}


                </SelectBox>

            </div>

        </Card>

        }


        {monthlyCategoricalData && 

        <Card>

            <div className="d-flex justify-content-between">
                <Title>Categorical Spending for {selectedMonthCategory}</Title>
                <Button onClick={handleExpandCategory}>View more about {selectedMonthCategory}</Button>

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
                
              <SelectBox value={value} onValueChange={handleRequestedCategoryMonth} placeholder="Select a month">

                    {lastTwelveMonths.reverse().map((month) => (

                        <SelectBoxItem key={month} value={month} text={month}  />
                        
                    ))}

                </SelectBox>

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
                
              <SelectBox value={value} onValueChange={handleRequestedPopularItemsMonth} placeholder="Select a month">

                    {lastTwelveMonths.reverse().map((month) => (

                        <SelectBoxItem key={month} value={month} text={month}  />
                        
                    ))}

                </SelectBox>

            </div>
        
        </Card>

        }


        </div>


    )

}

export default MonthlyGraphs;