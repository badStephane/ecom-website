import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from './../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const fetchProductData = () => {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        // Handle both image (string) and images (array)
        const imageToUse = Array.isArray(product.images) 
          ? product.images[0] 
          : Array.isArray(product.image) 
            ? product.image[0] 
            : product.image;
        setImage(imageToUse);
      }
    };
    fetchProductData();
  }, [productId, products]);

  const getProductImages = () => {
    if (!productData) return [];
    if (Array.isArray(productData.images) && productData.images.length > 0) {
      return productData.images;
    }
    if (Array.isArray(productData.image) && productData.image.length > 0) {
      return productData.image;
    }
    if (typeof productData.image === 'string') {
      return [productData.image];
    }
    return [];
  };

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*---------- product images ----------*/}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {getProductImages().map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt="product_image"
              />
            ))}
          </div>

          <div className="w-4 sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="product_img" />
          </div>
        </div>

        {/*---------- product info ----------*/}
        <div className="flex-1">
          <h1 className="font-medium text-2xl">{productData.name}</h1>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Sélectionner la taille</p>
            <div className="flex gap-2">
              {productData.sizes && productData.sizes.length > 0 ? (
                productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`border py-2 px-4 bg-gray-100 ${
                      item === size ? "border-orange-500" : ""
                    }`}
                    key={index}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">Aucune taille disponible</p>
              )}
            </div>
          </div>

          {productData.stock > 0 ? (
            <button 
              onClick={()=>addToCart(productData._id,size)} 
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              disabled={!size}
            >
              AJOUTER AU PANIER
            </button>
          ) : (
            <button 
              disabled
              className="bg-gray-400 text-white px-8 py-3 text-sm cursor-not-allowed"
            >
              RUPTURE DE STOCK
            </button>
          )}

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Produit 100% authentique.</p>
            <p>Paiement à la livraison disponible pour ce produit.</p>
            <p>Politique de retour et d&apos;échange facile sous 7 jours.</p>
          </div>
        </div>
      </div>

      {/*---------- Description Section ----------*/}
      <div className="mt-20">
        <div className="border px-6 py-4 text-sm text-gray-500">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Description</h2>
          <p>
            {productData.description || "Aucune description disponible"}
          </p>
        </div>
      </div>

      {/* ---------- Display related products ---------- */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  );
};

export default Product;