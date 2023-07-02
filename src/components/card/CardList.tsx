import { useState } from 'react'

import useArticle from "../../hooks/useArticle"
import CardItem from './CardItem'
import Spinner from '../../assets/Spinner'
import SectionButton from "../button/SectionButton"
import { ContextTypes, ResultTypes } from '../../types/types'


const CardList = () => {
    const { results, isLoading, sections }  = useArticle() as ContextTypes
    const [isColored, setIsColored] = useState<string>('All')

    return isLoading ? (
        <Spinner />
    ) : (
        <main className="container-lg">
            {sections && sections.map((section) => (
                <SectionButton 
                    key={section} 
                    section={section}
                    color={(isColored) => setIsColored(isColored)}
                    active={`${isColored === section ? "text-bg-primary" : "text-bg-light"}`}
                />
            ))}
            <div className="container">
                <div id="cardContainer" className="row gx-3 gy-5 pb-5">
                {results && results.map((item: ResultTypes) => (
                    <CardItem key={item.id} item={item}/>
                ))}
                </div>
            </div>
        </main>
    )
}

export default CardList