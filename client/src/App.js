import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BarcodeScanner from './components/BarcodeScanner';
import './App.css'; // Optional CSS file for styles

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/fooditems');
      setFoodItems(res.data);
    } catch (err) {
      console.error('Error fetching food items:', err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!category || !name || !calories || !barcode) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const newItem = {
        category,
        name,
        calories: parseInt(calories),
        barcode,
        imageUrl,
      };
      await axios.post('http://localhost:8080/api/fooditems', newItem);
      fetchItems();
      setCategory('');
      setName('');
      setCalories('');
      setBarcode('');
      setImageUrl('');
    } catch (err) {
      console.error('Error adding item:', err.message);
    }
  };

  const handleBarcodeDetected = useCallback(async (scannedCode) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/fooditems/barcode/${scannedCode}`);
      if (res.data) {
        alert(`Item found:\n${res.data.name} - ${res.data.category}`);
      } else {
        alert('No item found for this barcode.');
      }
    } catch (err) {
      console.error('Barcode lookup error:', err.message);
      alert('Item not found in database.');
    }
  }, []);

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App" style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h1 style={{ color: '#2c3e50' }}>Food Scanner App</h1>

      <form onSubmit={handleAddItem} style={{ marginBottom: '20px' }}>
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Food Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Calories" type="number" value={calories} onChange={e => setCalories(e.target.value)} />
        <input placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} />
        <input placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <button type="submit" style={{ marginLeft: '10px' }}>Add Item</button>
      </form>

      <input
        type="text"
        placeholder="Search food items"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px' }}
      />

      <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '40px' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Calories</th>
            <th>Barcode</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.calories}</td>
              <td>{item.barcode}</td>
              <td>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=N/A';
                          }}
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Barcode Scanner</h2>
      <BarcodeScanner onScan={handleBarcodeDetected} />
    </div>
  );
}

export default App;
