
import {CardItemTypes} from '../../types/types'


const CardItem = ({ item }: CardItemTypes) => {
  const src =  item.media && 
               item.media[0] &&   
               item.media[0]['media-metadata'] && 
               item.media[0]['media-metadata'][2] ? 
               item.media[0]['media-metadata'][2].url : 
               "https://www.vectorlogo.zone/logos/nytimes/nytimes-ar21.svg"

  return (
    <div className="col-xl-4 col-md-6">
      <div className="card">
          <img 
            src={src}
            alt={`${item.title}`} 
            className={
              src && src === 
              "https://www.vectorlogo.zone/logos/nytimes/nytimes-ar21.svg" ? 
              "card-img-top py-4" : 
              "card-img-top" 
            }/>
          <div className="card-body">
              <span className="fs-6 fst-italic">{item.published_date}</span>
              <h5 className="card-title">{item.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{item.section}</h6>
              <p className="mt-4">{item.abstract}</p>
              <a href={item.url} title={`Read "${item.title}"`} className="link btn-primary">View Article</a>
          </div>
      </div>
    </div>
  )
}

export default CardItem
