import { 
    createContext, 
    useEffect, 
    useState, 
} from "react"

import {
    ContextTypes, 
    ArticleProviderProp, 
    FilterSectionType,
    ResultTypes,
} from '../types/types'


const ArticleContext = createContext<ContextTypes | []>([])

export const ArticleProvider = ({ children }:ArticleProviderProp) => {

    const apiKey = 'BQxkmuUoGMCSPIiiEkNhyCBd2zuXzlBE'
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    const [ results, setResults ] = useState<ResultTypes[]>([])
    const [ sections, setSections ] = useState<string[]>([])
    const [originalResults, setOriginalResults] = useState<ResultTypes[]>([])

    useEffect(() => {
        fetchArticle()
    },[]) 

    const fetchArticle = async () => {

        try {
            const response = await fetch(`https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=${apiKey}`)
            const data = await response.json()
            const fetchedResults: ResultTypes[] = data.results

            setResults(fetchedResults)   
            setOriginalResults(fetchedResults)
            setIsLoading(false)
            setSections(['All', ...new Set<string>(fetchedResults.map((item: ResultTypes) => item.section))]);

        } catch (error) {
            console.error(error)
        }
    }


    const filterSection:FilterSectionType = (
        section) => {
        const filteredResults: ResultTypes[] = originalResults.filter((item:ResultTypes) => item.section === section)
        section && section === 'All' ? setResults(originalResults) : setResults(filteredResults) 
     
    }

    return (
        <ArticleContext.Provider
        value={{
            results,
            isLoading,
            sections,
            setResults,
            filterSection,
        }}>
            { children }
        </ArticleContext.Provider>
    )
}

export default ArticleContext
