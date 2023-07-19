import { useContext } from "react"
import ArticleContext from "../context/ArticleContext"

const useArticle = () => useContext(ArticleContext)

export default useArticle
