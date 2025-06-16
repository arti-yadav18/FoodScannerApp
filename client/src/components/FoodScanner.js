import React, { useState, useEffect } from "react";

const FoodScanner = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [form, setForm] = useState({ name: "", calories: "", category: "", id: null });

  useEffect(() => {
    fetch("/api/scan")
      .then(res => res.json())
      .then(data => setFoodItems(data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/scan/${form.id}` : "/api/scan";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        calories: form.calories,
        category: form.category
      })
    })
      .then(() => {
        setForm({ name: "", calories: "", category: "", id: null });
        return fetch("/api/scan").then(res => res.json()).then(setFoodItems);
      });
  };

  const handleEdit = item => {
    setForm({ ...item });
  };

  const handleDelete = id => {
    fetch(`/api/scan/${id}`, { method: "DELETE" })
      .then(() => fetch("/api/scan").then(res => res.json()).then(setFoodItems));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Food Scanner</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="calories" placeholder="Calories" type="number" value={form.calories} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <button type="submit">{form.id ? "Update" : "Add"}</button>
      </form>

      <h3>Scanned Items</h3>
      <ul>
        {foodItems.map(item => (
          <li key={item.id}>
            {item.name} - {item.calories} cal - {item.category}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodScanner;
