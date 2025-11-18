import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct } from '../../store/adminProductSlice';
import { categoriesAPI } from '../../services/api';
import { uploadImageFromUrl } from '../../utils/cloudinaryUpload';

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(state => state.adminProducts.items);
  const [token, setToken] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    sizes: '',
    colors: '',
    image: '',
    images: []
  });

  // Get token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('No admin token found in localStorage');
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        setCategories(res.data.categories || res.data || []);
      } catch (error) {
        console.error('Failed to load categories', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const product = products.find(p => p._id === id);
      if (product) {
        const allImages = product.images && product.images.length > 0 
          ? product.images 
          : (product.image ? [product.image] : []);
        
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice || '',
          stock: product.stock,
          category: product.category?._id || '',
          sizes: product.sizes?.join(', ') || '',
          colors: product.colors?.join(', ') || '',
          image: product.image || '',
          images: allImages
        });
        setImagePreviews(allImages);
      }
    }
  }, [id, products]);

  const handleImageUpload = async () => {
    if (!imageUrl.trim()) {
      setUploadError('Please enter an image URL');
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      const result = await uploadImageFromUrl(imageUrl, token);
      
      // Ajouter à la liste des images
      const newImages = [...formData.images, result.url];
      
      // Si c'est la première image, la définir comme image principale
      if (formData.images.length === 0) {
        setFormData(prev => ({ 
          ...prev, 
          image: result.url,
          images: newImages 
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          images: newImages 
        }));
      }
      
      // Ajouter au prévisualisation
      setImagePreviews(prev => [...prev, result.url]);
      setImageUrl('');
    } catch (error) {
      setUploadError(error.message || 'Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({ 
      ...prev, 
      images: newImages,
      // Si on supprime l'image principale, utiliser la première de la liste
      image: newImages.length > 0 ? newImages[0] : ''
    }));
    
    setImagePreviews(newPreviews);
  };

  const handleSetMainImage = (index) => {
    const mainImageUrl = formData.images[index];
    setFormData(prev => ({
      ...prev,
      image: mainImageUrl
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!formData.image) {
      setUploadError('Please upload an image');
      return;
    }

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      stock: parseInt(formData.stock, 10),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c)
    };

    try {
      let result;
      if (id) {
        result = await dispatch(updateProduct({ id, data })).unwrap();
      } else {
        result = await dispatch(createProduct(data)).unwrap();
      }

      if (result) {
        navigate('/admin/products');
      }
    } catch (error) {
      setUploadError(error?.message || 'Failed to save product');
      console.error('Product save error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Product' : 'Create Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sizes (comma separated)</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="XS, S, M, L, XL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Colors (comma separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="Black, White, Red"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
          
          {/* URL Input Area */}
          <div className="mb-4 flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={uploading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading || !imageUrl.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {uploading ? 'Uploading...' : 'Add Image'}
            </button>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {uploadError}
            </div>
          )}

          {/* Images Gallery */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Images ({imagePreviews.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="relative overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 h-32 w-32">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Main Image Badge */}
                      {formData.image === imageUrl && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                          Main
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                      {formData.image !== imageUrl && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(index)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          title="Set as main image"
                        >
                          Main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        title="Remove image"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No images message */}
          {imagePreviews.length === 0 && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
              No images added yet. Add at least one image above.
            </div>
          )}

          {/* Image URLs Display */}
          {formData.images.length > 0 && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Image URLs:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {formData.images.map((url, index) => (
                  <p key={index} className="text-xs text-gray-700 font-mono break-all">
                    {index + 1}. {url}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
