import { 
    ReactNode,
    MouseEvent,
} from 'react'

export interface ResultTypes {
    abstract: string
    published_date: string
    title: string
    media: {
        "media-metadata": {
            url: string
        }[]
    }[]
    section: string
    url: string 
    id: string
    key: string
}[]

export interface ContextTypes {
    results: ResultTypes[]
    isLoading: boolean
    sections: string[]
    setResults: any
    filterSection: (
        section: string
    ) => void
}

export type FilterSectionType = (value: string) => void

export type HandleClickTypes = (
    e: MouseEvent<HTMLDivElement>,
    color: (value: string) => void
) => void

    
export type ArticleProviderProp = {
    children: ReactNode
}

export type CardItemTypes = {
    item: ResultTypes
}
  
export type ButtonTypes = {
    section: string
    color: (value: string) => void
    active: string
}

export type SignUpFormPropTypes = {
    title: string
    subtitle: string
}
