import { useMemo, useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "./../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "./../components/Title";
import ProducItem from "./../components/ProducItem";

const Collection = () => {
  const { products, categories, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);

  // state of sorting by price
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // const toggleSubCategory = (e) => {
  //   if (subCategory.includes(e.target.value)) {
  //     setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
  //   } else {
  //     setSubCategory((prev) => [...prev, e.target.value]);
  //   }
  // };

  const applyFilter = useCallback(() => {
    let productsCopy = products.slice();

    // Filter out products with stock === 0
    productsCopy = productsCopy.filter((item) => item.stock > 0 && item.isActive !== false);

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => {
        const itemCategoryId = item.category?._id || item.category;
        return category.includes(itemCategoryId);
      });
    }
    setFilterProducts(productsCopy);
  }, [products, search, showSearch, category]);

  //code of product sorting by high to low and low to high
  const sortProduct = useCallback(() => {
    let filterProductCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(filterProductCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        break;
    }
  }, [filterProducts, sortType]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter, category, search, showSearch, products]);

  // this code is for price wise product sorting
  useEffect(() => {
    sortProduct();
  }, [sortType, sortProduct]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTRES
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="dropdown_icon"
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <p key={cat._id} className="flex gap-2">
                  <input
                    className="w-4"
                    type="checkbox"
                    value={cat._id}
                    onChange={toggleCategory}
                  />
                  {cat.name}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Aucune catégorie disponible</p>
            )}
          </div>
        </div>

        
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"Toutes les"} text2={"COLLECTIONS"} />
          {/* Product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevent">Trier par : Pertinence</option>
            <option value="low-high">Trier par : Prix croissant</option>
            <option value="high-low">Trier par : Prix décroissant</option>
          </select>
        </div>

        {/* Map product */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProducItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
