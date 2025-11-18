import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from './Title';
import ProducItem from "./ProducItem";
import PropTypes from 'prop-types';

const RelatedProducts = ({category, subCategory}) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if(products.length > 0){
            let productsCopy = products.slice();

            // Filter out products with stock === 0
            productsCopy = productsCopy.filter(
              (item) => item.stock > 0 && item.isActive !== false
            );

            // Handle both ObjectId and populated category
            const categoryId = typeof category === 'object' && category._id ? category._id : category;

            productsCopy = productsCopy.filter((item) => {
                const itemCategoryId = typeof item.category === 'object' && item.category._id 
                    ? item.category._id 
                    : item.category;
                return categoryId === itemCategoryId;
            });
            
            if(subCategory) {
                productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
            }
            
            setRelated(productsCopy.slice(0, 5));
        }
    }, [products, category, subCategory])

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1={'RELATED'} text2={'PRODUCTS'}/>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-5"> 
                {related.length > 0 ? (
                    related.map((item, index) => (
                        <ProducItem 
                            key={index} 
                            id={item._id} 
                            name={item.name} 
                            price={item.price} 
                            image={item.image}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">Aucun produit connexe</p>
                )}
            </div>
        </div>
    )
}

RelatedProducts.propTypes = {
    category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string
        })
    ]),
    subCategory: PropTypes.string,
};

export default RelatedProducts