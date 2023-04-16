import moment from "moment";
import { TransactionResource } from "up-bank-api";

export function convertDataForGraphs(transactionInsight: TransactionResource[]){

    const months = []

    const chartdata = [];

    const start = moment().startOf('month')

    const currentMonth = moment().format('MMMM')

    months.push(currentMonth)

    for (let i = 0; i < 11; i++) {
        months.push(start.subtract(1, 'month').format('MMMM'))
    }

    months.reverse()

    for(let i = 0; i< months.length; i++ ){

        let month_found = months[i]

        const obj = transactionInsight.filter(val => moment(val.attributes.createdAt).format('MMMM') === month_found)

        if(obj.length > 1){

            let cost = 0;

            for(let k = 0; k < obj.length; k++){
                cost = cost + Math.abs(parseFloat(obj[k].attributes.amount.value))
            }

            chartdata.push({
                month: month_found,
                spend: cost
            })

         

        }

        else if (obj.length === 1){

            chartdata.push({
                month: month_found, 
                spend: Math.abs(parseFloat(obj[0].attributes.amount.value))
            })

    

        }

        else{
            chartdata.push({
                month: month_found, 
                spend: 0
            })

        


        }
    }


    return chartdata

}

export function generateTransactionSummaries(transactionInsight: TransactionResource[]){

    const months_with_years = []

    const informationData = []

    const start = moment().startOf('month')

    const currentMonth = moment().format('MMMM YYYY')

    months_with_years.push(currentMonth)

    for (let i = 0; i < 11; i++) {
        months_with_years.push(start.subtract(1, 'month').format('MMMM YYYY'))
    }

    months_with_years.reverse()

    for(let i = months_with_years.length; i >= 0; i--){

        let month_found_with_year = months_with_years[i]

        const obj = transactionInsight.filter(val => moment(val.attributes.createdAt).format('MMMM YYYY') === month_found_with_year)

        if(obj.length > 1){

            let cost = 0;

            for(let k = 0; k < obj.length; k++){
                cost = cost + Math.abs(parseFloat(obj[k].attributes.amount.value))
            }

            informationData.push({
                month: month_found_with_year,
                averageCost: (cost / obj.length).toFixed(2),
                totalCost: cost.toFixed(2),
                numberOfTransactions: obj.length,
                transactions: obj
            })

         

        }

        else if (obj.length === 1){

            const cost = Math.abs(parseFloat(obj[0].attributes.amount.value))

            informationData.push({
                month: month_found_with_year,
                averageCost: (cost / 1).toFixed(2),
                totalCost: cost.toFixed(2),
                numberOfTransactions: 1,
                transactions: obj
            })
    

        }

    }

    return informationData;



}





