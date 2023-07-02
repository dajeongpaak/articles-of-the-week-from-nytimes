
import useArticle from "../../hooks/useArticle"
import { 
    ContextTypes, 
    ButtonTypes, 
    HandleClickTypes 
} from '../../types/types'


const SectionButton = ({ section, color, active }:ButtonTypes) => {
    const {filterSection}  = useArticle() as ContextTypes

    const handleClick:HandleClickTypes = (e) => {
        e.preventDefault()
        const clickedSection = (e.currentTarget.textContent) as string
    
        color(clickedSection)
        filterSection(section)
}

    return (
        <>
            <div 
                onClick={(e) => handleClick(e, color)}
                key={section}
                className={`mr-1 mb-4 p-3 badge rounded-pill ${active}`}
            >{section}
            </div>
       </>
    )
}

export default SectionButton
