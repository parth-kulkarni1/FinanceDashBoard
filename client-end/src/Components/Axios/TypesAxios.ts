import { TransactionResource } from "up-bank-api"

type BrandFetchLinks = {
    name: string, 
    url: string
}

type BrandFetchLogoFormat = {
    src: string, 
    background: string,
    format: string, 
    size: number
}

type BrandFetchLogos = {
    type: string,
    theme: string, 
    formats: BrandFetchLogoFormat[]
}


type brandFetchReterive = {
    name: string, 
    domain: string, 
    description: string, 
    links: BrandFetchLinks[]
    logos: BrandFetchLogos[]

}

export type brandFetchSearch = {
    claimed: string, 
    name: string, 
    domain: string, 
    icon: string, 
    brandId: string
}

export type merchantResponse = {
    brandInfo: brandFetchSearch, 
    domainInfo: brandFetchReterive
}

type transactionSummary = {
    numberOfTransactions: number, 
    sumOfTransactions: number, 
    averageOfTransactions: number
}

export type pastTransactionsHistory = {
    transactionSummary :  transactionSummary
    pastTransactionsList: TransactionResource[]
}


export type childCategoryType = {
    categoryName: string | undefined,
    transaction: TransactionResource[]
  }

export type MonthlyCategoryDetailed = {
    parentCategory: string | undefined, 
    childCategory: childCategoryType[]
}

export type postObj = {
    transactionId: string, 
    tags: any

}

export type categoryList = {
    parentCategory: string | undefined, 
    childCategory: {id: string, name: string}[]
  }

