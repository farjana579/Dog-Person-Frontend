// rating icon from material ui(mui)
import { Rating } from '@mui/material';
// stylesheet
import styles from '../../styles/shopCard.module.css'
// Shop card component.
const ShopCard = ({ image, name, price, avgrating, ratingcount, paragraph }) => {
    return (
        <div>
            <div className={styles.bestCard}>
                {/* Image */}
                <img src={image}></img>
                {/* title is used to show full name of the product. if someone hover over the name. Because we don't showing full name of the product. */}
                <h3 title={name}>{name}</h3>
                <div className={styles.rating}>
                    {/* 
                    * Rating icon from mui.  
                    * readOnly means user can't change the rating.precision indicaes how preciously value will be evaluated. such as 3.4.
                    * value is the rating value.
                    * &nbsp; is to use space.
                    */}
                    <Rating value={avgrating} readOnly precision={0.1} />&nbsp;({ratingcount ? ratingcount : 0})
                </div>
                <div title={paragraph} className={styles.paragraph}>{paragraph}</div>
                <div className={styles.price}>৳ {price ? price : 0}</div>
                <button className={styles.btnStyle}>View</button>
            </div>
        </div>
    );
};

export default ShopCard;