import { TagInputResourceIdentifier, TransactionResource } from "up-bank-api"


// Used in the categories.all.controller
export type responseToReturnType= {
    parentCategory: string | undefined, 
    childCategory: {id: string, name: string}[]
}

export type statusVsSpendingType = {
    status: string, 
    income: number, 

}

// Used in the monthly_cateogry_spending_controller
export type monthlyCategorySpendingResponse = {
    category: string,
    totalSpent: number

}

// Used in the transaction.monthly.category.insight.controller
export type childCategoryType = {
    categoryName: string | undefined,
    transaction: TransactionResource[]
}

// Used in the transaction.monthly.category.insight.controller
export type dataToReturnType = {
    parentCategory: string | undefined, 
    childCategory: childCategoryType[]
}

export type userMerchantSummary = {
    numberOfTransactions: number, 
    sumOfTransactions: number, 
    averageOfTransactions: number
}

export type transactionSummaryResponse = {
    transactionSummary: userMerchantSummary,
    pastTransactionsList: TransactionResource[]
}

export type tagsCommonType = {
    transactionId: string, 
    tags: TagInputResourceIdentifier

}

export type listTop5CompaniesResponse = {
    companyName: string, 
    frequency: number
}
  

export type sessionExpiredType = {
    message: string
}

export type sessionExpiredRouteType = {
    expired: boolean
}
  
export type errorType = {
    error: string
}