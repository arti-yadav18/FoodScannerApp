import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [newItem, setNewItem] = useState({ name: '', calories: '', category: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/scan');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.calories || !newItem.category) return;

    try {
      await axios.post('/api/scan', newItem);
      setNewItem({ name: '', calories: '', category: '' });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/scan/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Filtering + Sorting
  let filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === 'All' || item.category === categoryFilter)
  );

  filteredItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'calories-asc':
        return a.calories - b.calories;
      case 'calories-desc':
        return b.calories - a.calories;
      default:
        return 0;
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>🍎 Food Scanner</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="All">All Categories</option>
          <option value="Fruit">Fruit</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Snack">Snack</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="">Sort By</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="calories-asc">Calories Low–High</option>
          <option value="calories-desc">Calories High–Low</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={newItem.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={newItem.calories}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newItem.category}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Calories</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.calories}</td>
              <td>{item.category}</td>
              <td>
                {/* You can expand this with inline edit form */}
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredItems.length === 0 && (
            <tr>
              <td colSpan="4">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
