export type brandFetchSearch = {
    claimed: string, 
    name: string, 
    domain: string, 
    icon: string, 
    brandId: string
}

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


export type brandFetchReterive = {
    name: string, 
    domain: string, 
    description: string, 
    links: BrandFetchLinks[]
    logos: BrandFetchLogos[]

}
