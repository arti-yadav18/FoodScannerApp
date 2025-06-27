import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [barcode, setBarcode] = useState('');

  // Fetch food items
  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/fooditems');
      setFoodItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Handle scan using useCallback
  const handleScan = useCallback((scannedBarcode) => {
    const matchedItem = foodItems.find(item => item.barcode === scannedBarcode);
    if (matchedItem) {
      alert(`Item Found: ${matchedItem.name}`);
    } else {
      alert('Item not found in the list.');
    }
  }, [foodItems]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8080/api/fooditems', {
        name,
        category,
        calories,
        barcode
      });
      fetchFoodItems(); // Refresh list
      setName('');
      setCategory('');
      setCalories('');
      setBarcode('');
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Food Scanner App</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search food items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', marginBottom: '20px', width: '300px' }}
      />

      {/* Form to Add Item */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          placeholder="Calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
        <input
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          required
        />
        <button type="submit">Add Food Item</button>
      </form>

      {/* Barcode Scanner */}
      <h2>Scan Barcode</h2>
      <BarcodeScanner onScan={handleScan} />

      {/* Food Items Table */}
      <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Calories</th>
            <th>Barcode</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.calories}</td>
              <td>{item.barcode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
