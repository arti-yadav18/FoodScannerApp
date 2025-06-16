import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', calories: '', category: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get('/api/scan');
    setItems(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/scan/${id}`);
    fetchItems();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, calories: item.calories, category: item.category });
    setEditId(item.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/scan/${editId}`, form);
    } else {
      await axios.post('/api/scan', form);
    }
    setForm({ name: '', calories: '', category: '' });
    setEditId(null);
    fetchItems();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Food Scanner</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Food name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Calories"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> ({item.calories} cal) - {item.category}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
