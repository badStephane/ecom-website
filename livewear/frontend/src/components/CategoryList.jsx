import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import PropTypes from "prop-types";

const CategoryList = ({ onCategorySelect }) => {
  const { categories } = useContext(ShopContext);

  if (!categories || categories.length === 0) {
    return (
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <Title text1={"NOS"} text2={"CATEGORIES"} />
        </div>
        <p className="text-center text-gray-500">Aucune catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"NOS"} text2={"CATEGORIES"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explorez notre collection par catégorie
        </p>
      </div>

      <div className={`grid gap-6 ${categories.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => onCategorySelect && onCategorySelect(category._id)}
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 cursor-pointer hover:shadow-lg transition duration-300 text-center group"
          >
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 mx-auto mb-4 object-cover rounded-lg group-hover:scale-110 transition"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-gray-600 mt-2">
                {category.description}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-3 group-hover:font-semibold transition">
              Découvrir la collection →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

CategoryList.propTypes = {
  onCategorySelect: PropTypes.func,
};

export default CategoryList;
