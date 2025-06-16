import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetch('/api/scan')
      .then(res => res.json())
      .then(data => setFoods(data));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const newItem = { name, calories, category };
    fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
      .then(res => res.json())
      .then(added => {
        setFoods([...foods, added]);
        setName('');
        setCalories('');
        setCategory('');
      });
  };

  const filteredFoods = foods
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const toggleSort = field => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="App">
      <h1 style={{ color: '#2c3e50' }}>Nutri Scan</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Food Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Calories"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          required
        />
        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <button type="submit" style={{ backgroundColor: '#27ae60', color: '#fff' }}>
          Add Food
        </button>
      </form>

      <input
        type="text"
        placeholder="Search by name or category..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-box"
      />

      <table>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: '#ecf0f1' }}>
            <th>ID</th>
            <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
              Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => toggleSort('calories')} style={{ cursor: 'pointer' }}>
              Calories {sortField === 'calories' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => toggleSort('category')} style={{ cursor: 'pointer' }}>
              Category {sortField === 'category' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredFoods.map(item => (
            <tr key={item.id} style={{ backgroundColor: '#f9f9f9' }}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.calories}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App;
