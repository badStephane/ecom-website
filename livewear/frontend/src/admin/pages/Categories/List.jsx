import { useEffect, useState } from 'react';
import { categoriesAPI } from '../../services/api';
import { Edit2, Trash2 } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.categories || res.data || []);
    } catch (error) {
      console.error('Failed to load categories', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoriesAPI.update(editId, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      loadCategories();
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditId(null);
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setFormData({ name: category.name, description: category.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoriesAPI.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Categories</h1>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{editId ? 'Edit' : 'Create'} Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg">
                {editId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setFormData({ name: '', description: '' });
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition text-center"
          >
            <p className="text-2xl mb-2">+</p>
            <p className="font-semibold">Add Category</p>
          </button>
        )}

        {categories.map((category) => (
          <div key={category._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
