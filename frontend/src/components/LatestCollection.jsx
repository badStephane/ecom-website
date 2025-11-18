import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProducItem from "./ProducItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Filter out products with stock === 0 and get latest 10
    const availableProducts = products.filter(
      (product) => product.stock > 0 && product.isActive !== false
    );
    setLatestProducts(availableProducts.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"DERNIERES"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Découvrez nos toutes dernières créations en crochet, lin et coton.
        </p>
      </div>


{/* rendering latest products */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
{
  latestProducts.map((item,index)=>(
    <ProducItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
  ))
}
</div>
    </div>
  );
};

export default LatestCollection;
